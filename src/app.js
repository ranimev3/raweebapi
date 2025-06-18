import express from 'express';
import cors from 'cors';
import bacakomik from './routesv2/router.js');
import apiRoutes from './routes/apiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


app.use('/api', apiRoutes);
app.use('/api/bacakomik', bacakomik);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
