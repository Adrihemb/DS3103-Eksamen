import { Request, Response } from 'express';

export class ExampleController {
    public async getExample(req: Request, res: Response): Promise<void> {
        try {
            // Business logic for handling the request
            res.status(200).json({ message: 'Example response' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    public async createExample(req: Request, res: Response): Promise<void> {
        try {
            // Business logic for creating a new resource
            res.status(201).json({ message: 'Resource created' });
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

// Export all controllers
export default {
    ExampleController,
};