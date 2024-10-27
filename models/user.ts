import { DataTypes, Model, Optional } from 'sequelize';
import { Sequelize } from 'sequelize';

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  displayName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  firebaseUid: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public displayName!: string;
  public email!: string;
  public password!: string;
  public role!: 'user' | 'admin';
  public firebaseUid!: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Initialize the model
  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        displayName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          validate: {
            isEmail: true,
          },
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.ENUM('user', 'admin'),
          allowNull: false,
          defaultValue: 'user',
        },
        firebaseUid: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
      }
    );
  }
}

export default User;
