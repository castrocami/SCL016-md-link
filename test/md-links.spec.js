const { getLinksFromFile, getStatusForUrl, mdLinks } = require('../index.js');

// Get Status for url
jest.mock('node-fetch'); // mockear la libreria 
const fetch = require('node-fetch'); // cuando la importo , estoy importando la libreria mockeada
describe('getStatusForUrl', () => {
  it('should be a function', () => {
    expect(typeof getStatusForUrl).toBe('function');
  });
  // https://jestjs.io/docs/bypassing-module-mocks
  it('should return ok and status code for a correct link', () => {
    fetch.mockReturnValue(Promise.resolve({ status: 200, statusText: 'ok' })); // mockReturnValue es un  metodo que me da el mockeado de fetch
    getStatusForUrl("okurl").then(obj => {
      expect(obj.status).toBe(200);
      expect(obj.ok).toBe('ok');
    });
  });
  it('should return error message in field ok when fetch fails', () => {
    fetch.mockImplementation(() => { //La proxima vez que llame a fech quiero que la promesa devuelva reject (Falla). En vez de fetch corre la implementacion que le doy
      return Promise.reject("Error calling fetch");
    });
    getStatusForUrl("okurl").then(obj => {
      expect(obj.ok).toBe('fail: Error calling fetch');
    });
  });
});

// Get Links from File
describe('getLinksFromFile', () => {
  it('should be a function', () => {
    expect(typeof getLinksFromFile).toBe('function');
  });
  it('should return an array', () => {
    return getLinksFromFile("readmeTest.md").then(result => {
      expect(typeof result).toBe('object');
    })
  })
});

//Md-Links
describe('mdLinks', () => {
  it('should be a function', () => {
    expect(typeof mdLinks).toBe('function');
  });
  it('should resolve to an object when validate is true', () => {
    return mdLinks("readmeTest.md", { validate: true }).then(finalResult => {
      expect(typeof finalResult).toBe('object');
    })
  })
  it('should resolve to an object when validate is false', () => {
    return mdLinks("readmeTest.md", { validate: false }).then(finalResult => {
      expect(typeof finalResult).toBe('object');
    })
  })
  it('should return a object', () => {
    return mdLinks("./hola", { validate: false }).then(totalLinks => {
      expect(typeof totalLinks).toBe('object');
      console.log(totalLinks)
    })
  })
});