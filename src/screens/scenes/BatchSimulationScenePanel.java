package screens.scenes;

import Controllers.BatchSimulatorController;
import Models.HomePageModel;
import ilcompiler.input.Input.InputType;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Image;
import java.awt.event.ComponentAdapter;
import java.awt.event.ComponentEvent;
import java.util.Map;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.ImageIcon;
import javax.swing.JPanel;

public class BatchSimulationScenePanel extends javax.swing.JPanel implements IScenePanel {

    private InputEventListener inputListener;

    private Runnable onCriticalFailureCallback;

    private final Image backgroundImage;
    private final double imageAspectRatio;
    private static final int BASE_WIDTH = 624;
    private static final int BASE_HEIGHT = 394;

    private final BatchSimulatorController controller;
    private final BatchSimulatorController.FillHeight tankFillHeightWrapper;

    private final PushButton startBt, stopBt;
    private final PushButton[] buttons;

    private final RedIndicator runLed, idleLed, fullLed;
    private final RedIndicator pump1Indicator, pump3Indicator, mixerIndicator, hiLevelIndicator, loLevelIndicator;

    private final RedIndicator[] indicators;
    
    private JPanel buttonsPanel;
    private JPanel ledsPanel;

    private Long hiLevelActivationTime = null;
    private boolean alertShown = false;

    private Long loLevelActivationTime = null;
    private boolean pump3AlertShown = false;

     private static final int timerForPumpsWarning = 1500;

    public BatchSimulationScenePanel() {
        ImageIcon bgIcon = new ImageIcon(getClass().getResource("/Assets/batch_bg.png"));
        backgroundImage = bgIcon.getImage();
        imageAspectRatio = (double) bgIcon.getIconWidth() / bgIcon.getIconHeight();

        controller = new BatchSimulatorController(this);
        tankFillHeightWrapper = new BatchSimulatorController.FillHeight(0);

        startBt = new PushButton("I0.0", InputType.NO);
        stopBt = new PushButton("I0.1", InputType.NC, PushButton.ButtonPalette.RED);

        buttons = new PushButton[]{startBt, stopBt};

        runLed = new RedIndicator("Q1.0", RedIndicator.IndicatorType.LED);
        idleLed = new RedIndicator("Q1.1", RedIndicator.IndicatorType.LED);
        fullLed = new RedIndicator("Q1.2", RedIndicator.IndicatorType.LED);

        pump1Indicator = new RedIndicator("Q0.1");
        mixerIndicator = new RedIndicator("Q0.2");
        pump3Indicator = new RedIndicator("Q0.3");

        hiLevelIndicator = new RedIndicator("I1.0");
        loLevelIndicator = new RedIndicator("I1.1");

        indicators = new RedIndicator[]{runLed, idleLed, fullLed, pump1Indicator, pump3Indicator, mixerIndicator,
            hiLevelIndicator, loLevelIndicator};

        initComponents();
        
        addComponentListener(new ComponentAdapter() {
            @Override
            public void componentResized(ComponentEvent e) {
                repositionComponents();
            }
        });
    }

    @Override
    public void setOnCriticalFailureCallback(Runnable callback) {
        this.onCriticalFailureCallback = callback;
    }

    @Override
    public void initInputs(Map<String, InputType> inputsType, Map<String, Boolean> inputs) {
        for (PushButton button : buttons) {
            var key = button.getInputKey();
            var type = button.getType();

            inputsType.put(key, type);
            inputs.put(key, type == InputType.NC);
        }
    }

    @Override
    public void updateUIState(Map<String, InputType> inputsType, Map<String, Boolean> inputs,
            Map<String, Boolean> outputs) {
        for (RedIndicator indicator : indicators) {
            String key = indicator.getKey();
            boolean updatedValue = false;

            if (key.startsWith("Q")) {
                updatedValue = outputs.getOrDefault(key, false);
            } else if (key.startsWith("I")) {
                updatedValue = inputs.getOrDefault(key, false);
            }

            indicator.setActive(updatedValue);
        }
        boolean isRunning = HomePageModel.isRunning();

        boolean pump1On = outputs.getOrDefault(pump1Indicator.getKey(), false);
        boolean hiLevel = tankFillHeightWrapper.isAtHighLevel();
        boolean pump3On = outputs.getOrDefault(pump3Indicator.getKey(), false);
        boolean loLevel = tankFillHeightWrapper.isAtLowLevel();

        if (isRunning && pump1On) {
            controller.startFilling(tankFillHeightWrapper);
        } else {
            controller.stopFilling();
        }

        if (isRunning && pump3On) {
            controller.startDraining(tankFillHeightWrapper);
        } else {
            controller.stopDraining();
        }

        hiLevelIndicator.setActive(hiLevel);
        loLevelIndicator.setActive(loLevel);

        pump1IsOpened(pump1On, hiLevel);

        pump3IsOpened(pump3On, loLevel);

        inputs.put(hiLevelIndicator.getKey(), hiLevelIndicator.isActive());
        inputs.put(loLevelIndicator.getKey(), loLevelIndicator.isActive());

    }

    private void pump3IsOpened(boolean pump3On, boolean loLevel) {
        if (!loLevel && pump3On) {
            if (loLevelActivationTime == null) {
                loLevelActivationTime = System.currentTimeMillis();
            } else {
                long elapsed = System.currentTimeMillis() - loLevelActivationTime;
                if (elapsed > timerForPumpsWarning && !pump3AlertShown) {
                    pump3AlertShown = true;
                    javax.swing.SwingUtilities.invokeLater(() -> {
                        javax.swing.JOptionPane.showMessageDialog(
                                this,
                                "Não havia líquido para o esvaziamento. A bomba, pump3 (Q0.3), explodiu.",
                                "Falha Crítica",
                                javax.swing.JOptionPane.WARNING_MESSAGE
                        );

                        if (onCriticalFailureCallback != null) {
                            onCriticalFailureCallback.run();
                        }

                        this.resetUIState();
                    });
                }
            }
        } else {
            loLevelActivationTime = null;
            pump3AlertShown = false;
        }
    }

    private void pump1IsOpened(boolean pump1On, boolean hiLevel) {

        if (hiLevel && pump1On) {
            if (hiLevelActivationTime == null) {
                hiLevelActivationTime = System.currentTimeMillis();
            } else {
                long elapsed = System.currentTimeMillis() - hiLevelActivationTime;
                if (elapsed > timerForPumpsWarning && !alertShown) {
                    alertShown = true;
                    javax.swing.SwingUtilities.invokeLater(() -> {
                        javax.swing.JOptionPane.showMessageDialog(
                                this,
                                "A bomba de enchimento, pump1 (Q0.1), permaneceu ligada mesmo após o tanque atingir sua capacidade máxima, resultando em um transbordamento que inundou a fábrica.",
                                "Alerta de Segurança",
                                javax.swing.JOptionPane.WARNING_MESSAGE
                        );

                        if (onCriticalFailureCallback != null) {
                            onCriticalFailureCallback.run();
                        }
                        this.resetUIState();
                    });
                }
            }
        } else {
            hiLevelActivationTime = null;
            alertShown = false;
        }

    }

    @Override
    public void stop() {
        loLevelActivationTime = null;
        pump3AlertShown = false;
        hiLevelActivationTime = null;
        alertShown = false;
        controller.stopFilling();
        controller.stopDraining();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);

        Graphics2D g2d = (Graphics2D) g;
        
        int panelWidth = getWidth();
        int panelHeight = getHeight();
        double panelAspectRatio = (double) panelWidth / panelHeight;
        
        int drawWidth, drawHeight, drawX, drawY;
        double scale;
        
        if (panelAspectRatio > imageAspectRatio) {
            drawHeight = panelHeight;
            drawWidth = (int) (panelHeight * imageAspectRatio);
            drawX = (panelWidth - drawWidth) / 2;
            drawY = 0;
            scale = (double) drawHeight / BASE_HEIGHT;
        } else {
            drawWidth = panelWidth;
            drawHeight = (int) (panelWidth / imageAspectRatio);
            drawX = 0;
            drawY = (panelHeight - drawHeight) / 2;
            scale = (double) drawWidth / BASE_WIDTH;
        }
        
        g2d.drawImage(backgroundImage, drawX, drawY, drawWidth, drawHeight, this);

        controller.drawTankFill(g2d, tankFillHeightWrapper.value, drawX, drawY, scale);
    }

    @Override
    public void resetUIState() {
        controller.reset();
        tankFillHeightWrapper.value = 0;

        for (RedIndicator indicator : indicators) {
            indicator.setActive(false);
        }

        repaint();
    }

    @Override
    public void setInputListener(InputEventListener listener) {
        inputListener = listener;
        startBt.setInputEventListener(inputListener);
        stopBt.setInputEventListener(inputListener);
    }

    private void initComponents() {
        setBackground(new java.awt.Color(142, 177, 199));
        setMaximumSize(new java.awt.Dimension(624, 394));
        setMinimumSize(new java.awt.Dimension(624, 394));
        setName("");
        setPreferredSize(new java.awt.Dimension(624, 394));

        javax.swing.GroupLayout layout = new javax.swing.GroupLayout(this);
        this.setLayout(layout);
        layout.setHorizontalGroup(
                layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                        .addGap(0, 624, Short.MAX_VALUE));
        layout.setVerticalGroup(
                layout.createParallelGroup(javax.swing.GroupLayout.Alignment.LEADING)
                        .addGap(0, 394, Short.MAX_VALUE));

        addButtonsPanel();
        addLedsPanel();
        addSensorIndicators();
    }

    private void addButtonsPanel() {
        buttonsPanel = new JPanel();
        buttonsPanel.setOpaque(false);
        buttonsPanel.setLayout(new BoxLayout(buttonsPanel, BoxLayout.Y_AXIS));
        buttonsPanel.add(startBt);
        buttonsPanel.add(Box.createVerticalStrut(5));
        buttonsPanel.add(stopBt);

        setLayout(null);
        this.add(buttonsPanel);
    }

    private void addLedsPanel() {
        ledsPanel = new JPanel();
        ledsPanel.setOpaque(false);
        ledsPanel.setLayout(new BoxLayout(ledsPanel, BoxLayout.Y_AXIS));

        ledsPanel.add(runLed);
        ledsPanel.add(idleLed);
        ledsPanel.add(fullLed);

        this.add(ledsPanel);
    }

    private void addSensorIndicators() {
        this.add(pump1Indicator);
        this.add(mixerIndicator);
        this.add(pump3Indicator);
        this.add(hiLevelIndicator);
        this.add(loLevelIndicator);
    }
    
    private void repositionComponents() {
        int panelWidth = getWidth();
        int panelHeight = getHeight();
        double panelAspectRatio = (double) panelWidth / panelHeight;
        
        int drawWidth, drawHeight, drawX, drawY;
        double scale;
        
        if (panelAspectRatio > imageAspectRatio) {
            drawHeight = panelHeight;
            drawWidth = (int) (panelHeight * imageAspectRatio);
            drawX = (panelWidth - drawWidth) / 2;
            drawY = 0;
            scale = (double) drawHeight / BASE_HEIGHT;
        } else {
            drawWidth = panelWidth;
            drawHeight = (int) (panelWidth / imageAspectRatio);
            drawX = 0;
            drawY = (panelHeight - drawHeight) / 2;
            scale = (double) drawWidth / BASE_WIDTH;
        }
        
        int buttonsPanelWidth = (int) (60 * scale);
        int buttonsPanelHeight = (int) (65 * scale);
        int buttonsX = drawX + (int) (81 * scale);
        int buttonsY = drawY + drawHeight - buttonsPanelHeight - (int) (117 * scale);
        buttonsPanel.setBounds(buttonsX, buttonsY, buttonsPanelWidth, buttonsPanelHeight);
        
        int ledsPanelWidth = (int) (25 * scale);
        int ledsPanelHeight = (int) (65 * scale);
        int ledsX = drawX + (int) ((81 - 26 - 25) * scale);
        int ledsY = drawY + drawHeight - ledsPanelHeight - (int) (100 * scale);
        ledsPanel.setBounds(ledsX, ledsY, ledsPanelWidth, ledsPanelHeight);
        
        int indicatorSize = (int) (30 * scale);
        pump1Indicator.setBounds(drawX + (int) (125 * scale), drawY + (int) (45 * scale), indicatorSize, indicatorSize);
        mixerIndicator.setBounds(drawX + (int) (395 * scale), drawY + (int) (40 * scale), indicatorSize, indicatorSize);
        pump3Indicator.setBounds(drawX + (int) (550 * scale), drawY + (int) (378 * scale), indicatorSize, indicatorSize);
        hiLevelIndicator.setBounds(drawX + (int) (468 * scale), drawY + (int) (60 * scale), indicatorSize, indicatorSize);
        loLevelIndicator.setBounds(drawX + (int) (490 * scale), drawY + (int) (90 * scale), indicatorSize, indicatorSize);
    }
}
