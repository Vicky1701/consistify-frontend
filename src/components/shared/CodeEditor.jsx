import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Stack,
} from "@mui/material";
import {
  ContentCopy,
  FullscreenExit,
  Fullscreen,
  Code,
  PlayArrow,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  COLORS,
  SHADOWS,
  BORDER_RADIUS,
  SPACING,
} from "../../styles/designSystem";

// Language configurations for syntax highlighting
const LANGUAGE_CONFIGS = {
  javascript: {
    name: "JavaScript",
    color: "#f7df1e",
    extensions: [".js", ".jsx"],
    keywords: [
      "function",
      "const",
      "let",
      "var",
      "if",
      "else",
      "for",
      "while",
      "return",
      "class",
      "extends",
      "import",
      "export",
    ],
    comments: ["//", "/*", "*/"],
    strings: ['"', "'", "`"],
  },
  python: {
    name: "Python",
    color: "#3776ab",
    extensions: [".py"],
    keywords: [
      "def",
      "class",
      "if",
      "else",
      "elif",
      "for",
      "while",
      "return",
      "import",
      "from",
      "try",
      "except",
      "with",
    ],
    comments: ["#", '"""'],
    strings: ['"', "'", '"""'],
  },
  java: {
    name: "Java",
    color: "#ed8b00",
    extensions: [".java"],
    keywords: [
      "public",
      "private",
      "protected",
      "class",
      "interface",
      "extends",
      "implements",
      "if",
      "else",
      "for",
      "while",
      "return",
      "new",
      "this",
    ],
    comments: ["//", "/*", "*/"],
    strings: ['"'],
  },
  cpp: {
    name: "C++",
    color: "#659ad2",
    extensions: [".cpp", ".cc", ".cxx"],
    keywords: [
      "int",
      "char",
      "float",
      "double",
      "void",
      "class",
      "struct",
      "if",
      "else",
      "for",
      "while",
      "return",
      "new",
      "delete",
    ],
    comments: ["//", "/*", "*/"],
    strings: ['"', "'"],
  },
  c: {
    name: "C",
    color: "#659ad2",
    extensions: [".c"],
    keywords: [
      "int",
      "char",
      "float",
      "double",
      "void",
      "struct",
      "if",
      "else",
      "for",
      "while",
      "return",
      "malloc",
      "free",
    ],
    comments: ["//", "/*", "*/"],
    strings: ['"', "'"],
  },
};

// Simple syntax highlighter component
const SyntaxHighlighter = ({ code, language }) => {
  const config =
    LANGUAGE_CONFIGS[language?.toLowerCase()] || LANGUAGE_CONFIGS.javascript;

  const highlightSyntax = (text) => {
    if (!text) return "";

    let highlighted = text;

    // Highlight keywords
    config.keywords.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, "g");
      highlighted = highlighted.replace(
        regex,
        `<span style="color: #0066cc; font-weight: 600;">${keyword}</span>`
      );
    });

    // Highlight strings
    highlighted = highlighted.replace(
      /"([^"]*)"/g,
      '<span style="color: #22c55e;">"$1"</span>'
    );
    highlighted = highlighted.replace(
      /'([^']*)'/g,
      "<span style=\"color: #22c55e;\">'$1'</span>"
    );

    // Highlight comments
    highlighted = highlighted.replace(
      /\/\/.*$/gm,
      '<span style="color: #64748b; font-style: italic;">$&</span>'
    );
    highlighted = highlighted.replace(
      /\/\*[\s\S]*?\*\//g,
      '<span style="color: #64748b; font-style: italic;">$&</span>'
    );

    // Highlight numbers
    highlighted = highlighted.replace(
      /\b\d+\b/g,
      '<span style="color: #f59e0b;">$&</span>'
    );

    return highlighted;
  };

  const lines = code?.split("\n") || [];

  return (
    <Box
      sx={{
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        fontSize: "0.875rem",
        lineHeight: 1.6,
        overflow: "auto",
        width: "100%",
        minHeight: "300px",
      }}
    >
      {lines.map((line, index) => (
        <Box
          key={index}
          sx={{ display: "flex", minHeight: "1.5rem", width: "100%" }}
        >
          <Box
            sx={{
              color: "#94a3b8",
              textAlign: "right",
              paddingRight: "1rem",
              minWidth: "3rem",
              userSelect: "none",
              fontSize: "0.8rem",
              flexShrink: 0,
            }}
          >
            {index + 1}
          </Box>
          <Box
            sx={{
              flex: 1,
              paddingLeft: "0.5rem",
              wordBreak: "break-all",
              overflowWrap: "break-word",
            }}
            dangerouslySetInnerHTML={{
              __html: highlightSyntax(line) || "&nbsp;",
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

const CodeEditor = ({
  value = "",
  onChange,
  language = "javascript",
  placeholder = "Enter your code here...",
  readOnly = false,
  showLineNumbers = true,
  minHeight = "200px",
  maxHeight = "600px",
  showHeader = true,
  title,
  onRun,
  canRun = false,
  fullWidth = true,
  autoResize = true,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const languageConfig =
    LANGUAGE_CONFIGS[language?.toLowerCase()] || LANGUAGE_CONFIGS.javascript;

  return (
    <Paper
      sx={{
        border: `1px solid ${COLORS.secondary[200]}`,
        borderRadius: BORDER_RADIUS.lg,
        overflow: "hidden",
        boxShadow: SHADOWS.sm,
        width: fullWidth ? "100%" : "auto",
        height: autoResize ? "auto" : "100%",
        display: "flex",
        flexDirection: "column",
        ...(isFullscreen && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1300,
          borderRadius: 0,
          boxShadow: SHADOWS["2xl"],
          height: "100vh",
        }),
      }}
    >
      {showHeader && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `${SPACING.sm} ${SPACING.md}`,
            borderBottom: `1px solid ${COLORS.secondary[200]}`,
            backgroundColor: COLORS.secondary[50],
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Code sx={{ color: languageConfig.color, fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {title || `${languageConfig.name} Code`}
            </Typography>
            <Chip
              label={languageConfig.name}
              size="small"
              sx={{
                backgroundColor: `${languageConfig.color}20`,
                color: languageConfig.color,
                fontWeight: 500,
              }}
            />
          </Box>

          <Stack direction="row" spacing={1}>
            {!readOnly && (
              <Tooltip title={showPreview ? "Edit" : "Preview"}>
                <IconButton
                  size="small"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </Tooltip>
            )}

            {canRun && onRun && (
              <Tooltip title="Run Code">
                <IconButton size="small" onClick={onRun} color="success">
                  <PlayArrow />
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title={copied ? "Copied!" : "Copy Code"}>
              <IconButton size="small" onClick={handleCopy}>
                <ContentCopy />
              </IconButton>
            </Tooltip>

            <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              <IconButton size="small" onClick={toggleFullscreen}>
                {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      )}

      <Box
        sx={{
          flex: 1,
          height: isFullscreen ? "calc(100vh - 60px)" : "auto",
          minHeight: isFullscreen ? "auto" : minHeight,
          maxHeight: isFullscreen ? "none" : maxHeight,
          overflow: "auto",
          backgroundColor: "#fafafa",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {showPreview ? (
          <Box
            sx={{
              padding: SPACING.md,
              flex: 1,
              overflow: "auto",
              height: "100%",
            }}
          >
            <SyntaxHighlighter code={value} language={language} />
          </Box>
        ) : (
          <Box
            sx={{
              position: "relative",
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {showLineNumbers && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: "4rem",
                  backgroundColor: COLORS.secondary[100],
                  borderRight: `1px solid ${COLORS.secondary[200]}`,
                  fontSize: "0.8rem",
                  color: COLORS.secondary[500],
                  padding: `${SPACING.sm} 0`,
                  userSelect: "none",
                  zIndex: 1,
                  overflow: "hidden",
                }}
              >
                {value.split("\n").map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      textAlign: "right",
                      paddingRight: "0.5rem",
                      lineHeight: 1.6,
                      minHeight: "1.5rem",
                    }}
                  >
                    {index + 1}
                  </Box>
                ))}
              </Box>
            )}

            <textarea
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              readOnly={readOnly}
              placeholder={placeholder}
              style={{
                width: "100%",
                flex: 1,
                minHeight: isFullscreen ? "calc(100vh - 120px)" : "350px",
                border: "none",
                outline: "none",
                resize: isFullscreen ? "none" : "vertical",
                fontFamily: 'Monaco, Consolas, "Courier New", monospace',
                fontSize: "0.875rem",
                lineHeight: 1.6,
                padding: `${SPACING.sm} ${SPACING.md}`,
                paddingLeft: showLineNumbers ? "5rem" : SPACING.md,
                backgroundColor: "transparent",
                color: COLORS.secondary[800],
                boxSizing: "border-box",
              }}
            />
          </Box>
        )}
      </Box>

      {copied && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: COLORS.success[600],
            color: "white",
            padding: `${SPACING.xs} ${SPACING.md}`,
            borderRadius: BORDER_RADIUS.lg,
            boxShadow: SHADOWS.lg,
            fontSize: "0.875rem",
            fontWeight: 500,
            zIndex: 10,
          }}
        >
          Code copied to clipboard!
        </Box>
      )}
    </Paper>
  );
};

export default CodeEditor;
