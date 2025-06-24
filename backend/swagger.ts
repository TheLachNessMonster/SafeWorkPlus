import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SafeWork API',
    version: '1.0.0',
    description: 'A JSON-serialised REST API for accessing the SafeWork database.',
  },
  servers: [
    {
      url: 'http://localhost:3000',
    },
  ],
};

const options = {
  swaggerDefinition,
  // Point to the API routes with JSDoc annotations
  apis: ['./routes/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);