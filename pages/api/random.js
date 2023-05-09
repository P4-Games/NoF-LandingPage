export default (req, res) => {
    const randomInt = Math.floor(Math.random() * 120);
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`<h1>${randomInt}</h1>`);
  };