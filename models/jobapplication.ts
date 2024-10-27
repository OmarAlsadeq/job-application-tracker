import { DataTypes, Model, Optional } from 'sequelize';
import { Sequelize } from 'sequelize';

// Define the attributes of JobApplication
interface JobApplicationAttributes {
  id: number;
  companyName: string;
  jobTitle: string;
  status: string;
  dateApplied: Date;
  notes?: string;
  userId: string;
}

interface JobApplicationCreationAttributes extends Optional<JobApplicationAttributes, 'id'> {}

class JobApplication extends Model<JobApplicationAttributes, JobApplicationCreationAttributes>
  implements JobApplicationAttributes {
  public id!: number;
  public companyName!: string;
  public jobTitle!: string;
  public status!: string;
  public dateApplied!: Date;
  public notes?: string;
  public userId!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Initialize the model
  static initModel(sequelize: Sequelize) {
    JobApplication.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        companyName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        jobTitle: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        dateApplied: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          }
        },
      },
      {
        sequelize,
        modelName: 'JobApplication',
        tableName: 'job_applications',
      }
    );
  }
}

export default JobApplication;
