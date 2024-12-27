import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

// Proxy middleware
app.use('/api', async (req: Request, res: Response) => {
  try {
    const targetUrl = `${process.env.TARGET_API_URL}${req.url}`;
    
    const response = await axios({
      method: req.method,
      url: targetUrl,
      data: req.body,
      headers: {
        ...req.headers,
        host: new URL(process.env.TARGET_API_URL || '').host,
      },
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      res.status(error.response?.status || 500).json({
        error: error.message,
        data: error.response?.data
      });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, _: any) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
