import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
require('dotenv').config();

(async () => {

  // Init the Express application
  const app: Express = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get('/api/v0/filteredimage', async (req: Request, res: Response) => {
    try {
      const { image_url } = req.query;

      if (!image_url) {
        return res.status(400).send('Image URL required');
      }

      const filtered_image_path = await filterImageFromURL(image_url);

      return res.status(200).sendFile(filtered_image_path,
        () => { deleteLocalFiles([filtered_image_path]) })
    }

    catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
  })

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req: Request, res: Response) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();