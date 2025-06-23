import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tab,
  Tabs,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  ContentCopy,
  Link as LinkIcon,
  Analytics,
  OpenInNew,
  Refresh,
  Delete,
  Add,
  Remove
} from '@mui/icons-material';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams
} from 'react-router-dom';

// Logging Middleware Implementation
const logger = {
  async log(stack, level, packageName, message) {
    try {
      const logEntry = { stack, level, package: packageName, message };
      const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrbXIubW9oaXRzaW5naEBnbWFpbC5jb20iLCJleHAiOjE3NTA2NjUyNjcsImlhdCI6MTc1MDY2NDM2NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6ImZlZjViZjIzLTE1ZTAtNDY4YS1iNjY4LTMwOWJlNjY4NGNkZCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im1vaGl0IHNpbmdoIiwic3ViIjoiZGRiODJmNjktNmQxYy00NjlkLWE3NzUtZGRlOThkNzc3Nzc3In0sImVtYWlsIjoia21yLm1vaGl0c2luZ2hAZ21haWwuY29tIiwibmFtZSI6Im1vaGl0IHNpbmdoIiwicm9sbE5vIjoiMjIwMzAzMTA1MDM3OCIsImFjY2Vzc0NvZGUiOiJUUnpnV00iLCJjbGllbnRJRCI6ImRkYjgyZjY5LTZkMWMtNDY5ZC1hNzc1LWRkZTk4ZDc3Nzc3NyIsImNsaWVudFNlY3JldCI6ImFIUndhcXd0R2hua3B5VmIifQ.03uwwcyKtcbURsJQaUclcbuwVZipi8v8I9v8ls6etU0',
          'Client-ID': 'ddb82f69-6d1c-469d-a775-dde98d777777',
          'Client-Secret': 'aHRwaqwtGhnkpyVb'
        },
        body: JSON.stringify(logEntry)
      });
      return await response.json();
    } catch (error) {
      console.error('Logging failed:', error);
      return null;
    }
  }
};

const Log = (stack, level, packageName, message) => logger.log(stack, level, packageName, message);

// URL validation utility
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Generate random shortcode
const generateShortcode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Get geolocation info (mock)
const getLocationInfo = () => {
  const locations = ['Mumbai, India', 'Delhi, India', 'Bangalore, India', 'Chennai, India', 'Pune, India'];
  return locations[Math.floor(Math.random() * locations.length)];
};

function URLShortenerApp() {
  const [currentTab, setCurrentTab] = useState(0);
  const [urls, setUrls] = useState([{ original: '', shortcode: '', validity: 30 }]);
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [clickDetailsDialog, setClickDetailsDialog] = useState({ open: false, url: null });

  useEffect(() => {
    Log('frontend', 'info', 'component', 'URL Shortener App initialized');
    // Load saved URLs from memory
    const saved = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    setShortenedUrls(saved);
  }, []);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    Log('frontend', 'info', 'component', `Tab changed to ${newValue === 0 ? 'Shortener' : 'Statistics'}`);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { original: '', shortcode: '', validity: 30 }]);
      Log('frontend', 'info', 'component', 'New URL field added');
    }
  };

  const removeUrlField = (index) => {
    if (urls.length > 1) {
      const newUrls = urls.filter((_, i) => i !== index);
      setUrls(newUrls);
      Log('frontend', 'info', 'component', `URL field ${index} removed`);
    }
  };

  const updateUrl = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const validateInputs = () => {
    Log('frontend', 'info', 'utils', 'Validating URL inputs');
    
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      
      if (!url.original.trim()) {
        setError(`URL ${i + 1}: Original URL is required`);
        Log('frontend', 'warn', 'utils', `Validation failed: Empty URL at index ${i}`);
        return false;
      }
      
      if (!isValidUrl(url.original)) {
        setError(`URL ${i + 1}: Invalid URL format`);
        Log('frontend', 'warn', 'utils', `Validation failed: Invalid URL format at index ${i}`);
        return false;
      }
      
      if (url.validity && (!Number.isInteger(Number(url.validity)) || Number(url.validity) <= 0)) {
        setError(`URL ${i + 1}: Validity must be a positive integer`);
        Log('frontend', 'warn', 'utils', `Validation failed: Invalid validity at index ${i}`);
        return false;
      }
    }
    
    Log('frontend', 'info', 'utils', 'All URL inputs validated successfully');
    return true;
  };

  const shortenUrls = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    setError('');
    setSuccess('');
    
    Log('frontend', 'info', 'api', 'Starting URL shortening process');

    try {
      const newShortenedUrls = [];
      
      for (const url of urls) {
        const shortcode = url.shortcode || generateShortcode();
        
        // Check for shortcode uniqueness
        const existingUrl = shortenedUrls.find(u => u.shortcode === shortcode);
        if (existingUrl) {
          setError(`Shortcode '${shortcode}' already exists. Please choose a different one.`);
          Log('frontend', 'error', 'api', `Shortcode collision: ${shortcode}`);
          setLoading(false);
          return;
        }
        
        const validityMinutes = url.validity || 30;
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + validityMinutes);
        
        const shortenedUrl = {
          id: Date.now() + Math.random(),
          original: url.original,
          shortcode: shortcode,
          shortUrl: `http://localhost:3000/${shortcode}`,
          createdAt: new Date(),
          expiryDate: expiryDate,
          clicks: 0,
          clickHistory: []
        };
        
        newShortenedUrls.push(shortenedUrl);
        Log('frontend', 'info', 'api', `URL shortened successfully: ${shortcode}`);
      }
      
      const updatedUrls = [...shortenedUrls, ...newShortenedUrls];
      setShortenedUrls(updatedUrls);
      localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
      
      setSuccess(`Successfully shortened ${newShortenedUrls.length} URL(s)!`);
      setUrls([{ original: '', shortcode: '', validity: 30 }]);
      
      Log('frontend', 'info', 'api', `Successfully shortened ${newShortenedUrls.length} URLs`);
    } catch (error) {
      setError('Failed to shorten URLs. Please try again.');
      Log('frontend', 'error', 'api', `URL shortening failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess('Short URL copied to clipboard!');
    Log('frontend', 'info', 'utils', 'URL copied to clipboard');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleShortUrlClick = (shortenedUrl) => {
    // Check if URL is expired
    if (new Date() > new Date(shortenedUrl.expiryDate)) {
      setError('This short URL has expired');
      Log('frontend', 'warn', 'component', `Attempted to access expired URL: ${shortenedUrl.shortcode}`);
      return;
    }

    // Record click
    const clickData = {
      timestamp: new Date(),
      source: 'direct',
      location: getLocationInfo()
    };

    const updatedUrls = shortenedUrls.map(url => {
      if (url.id === shortenedUrl.id) {
        return {
          ...url,
          clicks: url.clicks + 1,
          clickHistory: [...url.clickHistory, clickData]
        };
      }
      return url;
    });

    setShortenedUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    
    Log('frontend', 'info', 'component', `Short URL clicked: ${shortenedUrl.shortcode}`);
    
    // Redirect to original URL
    window.open(shortenedUrl.original, '_blank');
  };

  const showClickDetails = (url) => {
    setClickDetailsDialog({ open: true, url });
    Log('frontend', 'info', 'component', `Viewing click details for: ${url.shortcode}`);
  };

  const deleteUrl = (urlId) => {
    const updatedUrls = shortenedUrls.filter(url => url.id !== urlId);
    setShortenedUrls(updatedUrls);
    localStorage.setItem('shortenedUrls', JSON.stringify(updatedUrls));
    setSuccess('URL deleted successfully');
    Log('frontend', 'info', 'component', `URL deleted: ${urlId}`);
    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: '#1976d2' }}>
        <Toolbar>
          <LinkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener App
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Tabs value={currentTab} onChange={handleTabChange} centered>
            <Tab icon={<LinkIcon />} label="URL Shortener" />
            <Tab icon={<Analytics />} label="Statistics" />
          </Tabs>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {currentTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Shorten Your URLs
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create up to 5 short URLs at once. Default validity is 30 minutes.
            </Typography>

            {urls.map((url, index) => (
              <Card key={index} sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label={`Original URL ${index + 1}`}
                      value={url.original}
                      onChange={(e) => updateUrl(index, 'original', e.target.value)}
                      placeholder="https://example.com"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <TextField
                      fullWidth
                      label="Custom Shortcode (optional)"
                      value={url.shortcode}
                      onChange={(e) => updateUrl(index, 'shortcode', e.target.value)}
                      placeholder="mycode"
                    />
                  </Grid>
                  <Grid item xs={12} md={2}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Validity (minutes)"
                      value={url.validity}
                      onChange={(e) => updateUrl(index, 'validity', e.target.value)}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {urls.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => removeUrlField(index)}
                          size="small"
                        >
                          <Remove />
                        </IconButton>
                      )}
                      {index === urls.length - 1 && urls.length < 5 && (
                        <IconButton
                          color="primary"
                          onClick={addUrlField}
                          size="small"
                        >
                          <Add />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            ))}

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={shortenUrls}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LinkIcon />}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Shortening...' : 'Shorten URLs'}
              </Button>
            </Box>

            {shortenedUrls.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Recently Created Short URLs
                </Typography>
                <Grid container spacing={2}>
                  {shortenedUrls.slice(-3).map((url) => (
                    <Grid item xs={12} key={url.id}>
                      <Card sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" noWrap>
                              <strong>Original:</strong> {url.original}
                            </Typography>
                            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                              <strong>Short URL:</strong> {url.shortUrl}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Expires: {new Date(url.expiryDate).toLocaleString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Copy Short URL">
                              <IconButton onClick={() => copyToClipboard(url.shortUrl)}>
                                <ContentCopy />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Open Short URL">
                              <IconButton onClick={() => handleShortUrlClick(url)}>
                                <OpenInNew />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>
        )}

        {currentTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5">
                URL Statistics
              </Typography>
              <Button
                startIcon={<Refresh />}
                onClick={() => {
                  const saved = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
                  setShortenedUrls(saved);
                  Log('frontend', 'info', 'component', 'Statistics refreshed');
                }}
              >
                Refresh
              </Button>
            </Box>

            {shortenedUrls.length === 0 ? (
              <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ py: 4 }}>
                No URLs have been shortened yet. Create some short URLs first!
              </Typography>
            ) : (
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Short URL</TableCell>
                      <TableCell>Original URL</TableCell>
                      <TableCell>Clicks</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Expires</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shortenedUrls.map((url) => {
                      const isExpired = new Date() > new Date(url.expiryDate);
                      return (
                        <TableRow key={url.id}>
                          <TableCell>
                            <Typography variant="body2" color="primary" sx={{ fontFamily: 'monospace' }}>
                              {url.shortUrl}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                              {url.original}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={url.clicks} 
                              color={url.clicks > 0 ? 'primary' : 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(url.createdAt).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="caption">
                              {new Date(url.expiryDate).toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={isExpired ? 'Expired' : 'Active'}
                              color={isExpired ? 'error' : 'success'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Tooltip title="Copy Short URL">
                                <IconButton size="small" onClick={() => copyToClipboard(url.shortUrl)}>
                                  <ContentCopy fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Open Short URL">
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleShortUrlClick(url)}
                                  disabled={isExpired}
                                >
                                  <OpenInNew fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="View Click Details">
                                <IconButton size="small" onClick={() => showClickDetails(url)}>
                                  <Analytics fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete URL">
                                <IconButton size="small" color="error" onClick={() => deleteUrl(url.id)}>
                                  <Delete fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        )}

        {/* Click Details Dialog */}
        <Dialog
          open={clickDetailsDialog.open}
          onClose={() => setClickDetailsDialog({ open: false, url: null })}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Click Details for {clickDetailsDialog.url?.shortcode}
          </DialogTitle>
          <DialogContent>
            {clickDetailsDialog.url && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Total Clicks: {clickDetailsDialog.url.clicks}
                </Typography>
                
                {clickDetailsDialog.url.clickHistory.length > 0 ? (
                  <List>
                    {clickDetailsDialog.url.clickHistory.map((click, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={`Click ${index + 1}`}
                            secondary={
                              <Box>
                                <Typography variant="body2">
                                  <strong>Time:</strong> {new Date(click.timestamp).toLocaleString()}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Source:</strong> {click.source}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Location:</strong> {click.location}
                                </Typography>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < clickDetailsDialog.url.clickHistory.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                    No clicks recorded yet.
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClickDetailsDialog({ open: false, url: null })}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

// Redirection component for short URLs
function RedirectShortUrl() {
  const { shortcode } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
    const found = saved.find(u => u.shortcode === shortcode);

    if (found) {
      if (new Date() > new Date(found.expiryDate)) {
        alert('This short URL has expired.');
        navigate('/');
      } else {
        window.location.href = found.original;
      }
    } else {
      alert('Short URL not found.');
      navigate('/');
    }
  }, [shortcode, navigate]);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6">Redirecting...</Typography>
    </Box>
  );
}

// Main App wrapper with routing
function AppWithRouting() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<URLShortenerApp />} />
        <Route path="/:shortcode" element={<RedirectShortUrl />} />
      </Routes>
    </Router>
  );
}

export default AppWithRouting;