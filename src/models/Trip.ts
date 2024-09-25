import { DataTypes, Model } from 'sequelize';
import sequelize from '../database/database';


class Trip extends Model {
  public id!: string;
  public origin!: string;
  public destination!: string;
  public cost!: number;
  public duration!: number;
  public type!: string;
  public display_name!: string;
  public deleted!: boolean; // deleted column to use for deleteTrip
}

Trip.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    origin: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    destination: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    display_name: {
      type: DataTypes.STRING,
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0, 
    },
  },
  {
    sequelize,
    modelName: 'Trip',
    tableName: 'trips',
    timestamps: true, // adding createdAt and updatetAt to keep track
  }
)

export default Trip;