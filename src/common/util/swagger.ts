import swaggerUi from 'swagger-ui-express';
import { Express, Request, Response } from 'express';
import { Router } from 'express';

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'API de Gestion de Portefeuille d\'Actions',
    description: 'API REST pour la gestion d\'un portefeuille d\'actions boursières et des utilisateurs.',
    version: '1.0.0',
  },
  servers: [{ url: 'http://localhost:3000', description: 'Développement' }],
  tags: [
    { name: 'Users', description: 'Opérations sur les utilisateurs' },
    { name: 'Stocks', description: 'Opérations sur les actions' },
  ],
  paths: {
    '/api/users/all': {
      get: {
        tags: ['Users'],
        summary: 'Récupérer tous les utilisateurs',
        responses: { '200': { description: 'Succès' } },
      },
    },
    '/api/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Récupérer un utilisateur par ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Succès' }, '404': { description: 'Non trouvé' } },
      },
    },
    '/api/users/email/{email}': {
      get: {
        tags: ['Users'],
        summary: 'Filtrer par email',
        parameters: [{ name: 'email', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Succès' } },
      },
    },
    '/api/users/active/{isActive}': {
      get: {
        tags: ['Users'],
        summary: 'Filtrer par statut actif',
        parameters: [{ name: 'isActive', in: 'path', required: true, schema: { type: 'string', enum: ['true', 'false'] } }],
        responses: { '200': { description: 'Succès' } },
      },
    },
    '/api/users/add': {
      post: {
        tags: ['Users'],
        summary: 'Créer un utilisateur',
        responses: { '201': { description: 'Créé' }, '400': { description: 'Invalide' } },
      },
    },
    '/api/users/update': {
      put: {
        tags: ['Users'],
        summary: 'Mettre à jour un utilisateur',
        responses: { '200': { description: 'Succès' }, '404': { description: 'Non trouvé' } },
      },
    },
    '/api/users/delete/{id}': {
      delete: {
        tags: ['Users'],
        summary: 'Supprimer un utilisateur',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Supprimé' }, '404': { description: 'Non trouvé' } },
      },
    },
    '/api/stocks/all': {
      get: {
        tags: ['Stocks'],
        summary: 'Récupérer toutes les actions',
        responses: { '200': { description: 'Succès' } },
      },
    },
    '/api/stocks/{id}': {
      get: {
        tags: ['Stocks'],
        summary: 'Récupérer une action par ID',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Succès' }, '404': { description: 'Non trouvé' } },
      },
    },
    '/api/stocks/name/{name}': {
      get: {
        tags: ['Stocks'],
        summary: 'Filtrer par nom',
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Succès' } },
      },
    },
    '/api/stocks/available/{status}': {
      get: {
        tags: ['Stocks'],
        summary: 'Filtrer par disponibilité',
        parameters: [{ name: 'status', in: 'path', required: true, schema: { type: 'string', enum: ['true', 'false'] } }],
        responses: { '200': { description: 'Succès' } },
      },
    },
    '/api/stocks/add': {
      post: {
        tags: ['Stocks'],
        summary: 'Ajouter une action',
        responses: { '201': { description: 'Créé' }, '400': { description: 'Invalide' } },
      },
    },
    '/api/stocks/update': {
      put: {
        tags: ['Stocks'],
        summary: 'Mettre à jour une action',
        responses: { '200': { description: 'Succès' }, '404': { description: 'Non trouvé' } },
      },
    },
    '/api/stocks/delete/{id}': {
      delete: {
        tags: ['Stocks'],
        summary: 'Supprimer une action',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Supprimé' }, '404': { description: 'Non trouvé' } },
      },
    },
  },
  components: {
    schemas: {},
  },
};

const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
};

export function setupSwagger(app: Express): void {
  const docsRouter = Router();
  // Documentation accessible à /api/
  docsRouter.use('/', swaggerUi.serve);
  docsRouter.get('/', swaggerUi.setup(swaggerDocument, swaggerOptions));

  app.use('/api/docs', docsRouter);

  // Route JSON pour la spécification
  app.get('/api/docs.json', (_req: Request, res: Response) => {
    res.json(swaggerDocument);
  });
}
