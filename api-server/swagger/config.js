const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API 명세서',
      version: '1.0.0',
    },
    components:{
      securitySchemes:{
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: ['./swagger/*.swagger.js'], // files containing annotations as above
};

module.exports = options;