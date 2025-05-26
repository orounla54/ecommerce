import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Charger les variables d'environnement
dotenv.config();

// Connecter à la base de données
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Configuration CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/categories', categoryRoutes);

// Configuration PayPal
app.get('/api/config/paypal', (req, res) => 
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID })
);

// Servir les fichiers statiques
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Configuration pour la production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API est en cours d\'exécution....');
  });
}

// Middleware de gestion d'erreurs
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5004;

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});