const { expect } = require('chai');
const request = require('supertest');
const app = require('../src/app.js');

describe('GET /recipes', () => {
  it('debe devolver todas las recetas cuando no se envian parametros por query', async () => {
    const response = await request(app).get('/recipes');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('debe devolver recetas que coincidan con el name pasado por query', async () => {
    const response = await request(app).get('/recipes?name=chicken');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    response.body.forEach(recipe => {
      expect(recipe.name.toLowerCase()).toContain('chicken');
    });
  });
});
