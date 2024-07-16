import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js';

export interface BookAttributes {
  isbn: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export class Book extends Model<BookAttributes> implements BookAttributes {
  public isbn!: string;
  public name!: string;
  public category!: string;
  public price!: number;
  public quantity!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Book.init({
  isbn: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Book',
});

export default Book;
