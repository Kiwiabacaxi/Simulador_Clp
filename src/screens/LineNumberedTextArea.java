package screens;

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.text.BadLocationException;
import javax.swing.text.Element;
import java.awt.*;

public class LineNumberedTextArea extends JPanel {
    
    private final JTextArea textArea;
    private final JTextArea lineNumberArea;
    private final JScrollPane scrollPane;
    
    public LineNumberedTextArea() {
        this(10, 50);
    }
    
    public LineNumberedTextArea(int rows, int columns) {
        setLayout(new BorderLayout());
        
        textArea = new JTextArea(rows, columns);
        textArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        textArea.setTabSize(4);
        
        lineNumberArea = new JTextArea(rows, 3);
        lineNumberArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        lineNumberArea.setEditable(false);
        lineNumberArea.setFocusable(false);
        lineNumberArea.setBackground(new Color(240, 240, 240));
        lineNumberArea.setForeground(Color.GRAY);
        lineNumberArea.setBorder(new EmptyBorder(0, 5, 0, 5));
        
        updateLineNumbers();
        
        textArea.getDocument().addDocumentListener(new javax.swing.event.DocumentListener() {
            @Override
            public void insertUpdate(javax.swing.event.DocumentEvent e) {
                updateLineNumbers();
            }
            
            @Override
            public void removeUpdate(javax.swing.event.DocumentEvent e) {
                updateLineNumbers();
            }
            
            @Override
            public void changedUpdate(javax.swing.event.DocumentEvent e) {
                updateLineNumbers();
            }
        });
        
        scrollPane = new JScrollPane(textArea);
        scrollPane.setRowHeaderView(lineNumberArea);
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_ALWAYS);
        
        lineNumberArea.addComponentListener(new java.awt.event.ComponentAdapter() {
            @Override
            public void componentResized(java.awt.event.ComponentEvent e) {
                updateLineNumbers();
            }
        });
        
        add(scrollPane, BorderLayout.CENTER);
    }
    
    private void updateLineNumbers() {
        SwingUtilities.invokeLater(() -> {
            int lineCount = textArea.getLineCount();
            StringBuilder sb = new StringBuilder();
            
            for (int i = 1; i <= lineCount; i++) {
                sb.append(String.format("%d: ", i));
                if (i < lineCount) {
                    sb.append("\n");
                }
            }
            
            String currentText = lineNumberArea.getText();
            if (!currentText.equals(sb.toString())) {
                lineNumberArea.setText(sb.toString());
            }
            
            try {
                int lineHeight = textArea.getFontMetrics(textArea.getFont()).getHeight();
                int preferredHeight = lineHeight * lineCount;
                
                Dimension currentSize = lineNumberArea.getPreferredSize();
                int newWidth = getLineNumberWidth();
                int newHeight = Math.max(preferredHeight, scrollPane.getViewport().getHeight());
                
                if (currentSize.width != newWidth || currentSize.height != newHeight) {
                    lineNumberArea.setPreferredSize(new Dimension(newWidth, newHeight));
                    lineNumberArea.revalidate();
                }
            } catch (Exception e) {
                // Ignore
            }
        });
    }
    
    private int getLineNumberWidth() {
        int lineCount = textArea.getLineCount();
        int digits = String.valueOf(lineCount).length();
        FontMetrics fm = lineNumberArea.getFontMetrics(lineNumberArea.getFont());
        return fm.stringWidth(String.format("%d: ", (int)Math.pow(10, digits) - 1)) + 10;
    }
    
    public JTextArea getTextArea() {
        return textArea;
    }
    
    public void setText(String text) {
        textArea.setText(text);
    }
    
    public String getText() {
        return textArea.getText();
    }
    
    public void setEditable(boolean editable) {
        textArea.setEditable(editable);
    }
    
    public void setFont(Font font) {
        if (textArea != null) {
            textArea.setFont(font);
            lineNumberArea.setFont(font);
            updateLineNumbers();
        }
    }
    
    public void setBackground(Color bg) {
        if (textArea != null) {
            textArea.setBackground(bg);
        }
    }
    
    public void setForeground(Color fg) {
        if (textArea != null) {
            textArea.setForeground(fg);
        }
    }
    
    public int getLineCount() {
        return textArea.getLineCount();
    }
    
    public int getLineStartOffset(int line) throws BadLocationException {
        return textArea.getLineStartOffset(line);
    }
    
    public int getLineEndOffset(int line) throws BadLocationException {
        return textArea.getLineEndOffset(line);
    }
    
    public String getText(int start, int length) throws BadLocationException {
        return textArea.getText(start, length);
    }
    
    public javax.swing.text.Document getDocument() {
        return textArea.getDocument();
    }
    
    public JScrollPane getScrollPane() {
        return scrollPane;
    }
}
