// src/components/JavaCodeEditor.jsx
import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';

export default function JavaCodeEditor({ initialCode = '', onRun }) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulate running Java code by sending to backend
  const handleRun = async () => {
    setLoading(true);
    setOutput('');
    try {
      // Replace with your backend endpoint for code execution
      const res = await fetch('http://localhost:8080/api/run-java', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      setOutput(data.output || '');
      if (onRun) onRun(code, data.output);
    } catch {
      setOutput('Error running code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" mb={1}>Java Code Editor</Typography>
      <TextField
        label="Java Code (main method)"
        value={code}
        onChange={e => setCode(e.target.value)}
        multiline
        minRows={8}
        maxRows={20}
        fullWidth
        variant="outlined"
        sx={{ fontFamily: 'monospace', mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handleRun} disabled={loading}>
        {loading ? 'Running...' : 'Run Code'}
      </Button>
      <Paper variant="outlined" sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', fontFamily: 'monospace' }}>
        <Typography variant="subtitle2">Output:</Typography>
        <pre style={{ margin: 0 }}>{output}</pre>
      </Paper>
    </Box>
  );
}
