import Token from '../models/token';
import Product from '../models/product';
import User from '../models/user';

export default class Database {
    private static instance: Database;
    private constructor() {}

    // DbSets
    public tokens: Token[] = []
    public products: Product[] = []
    public users: User[] = []

    public static getInstance(): Database {
        if (!this.instance) {
            this.instance = new Database();
        }

        return this.instance;
    }
}
