export default (req, res) => {
    const randomInt = Math.floor(Math.random() * 120);
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json([randomInt]);
  };