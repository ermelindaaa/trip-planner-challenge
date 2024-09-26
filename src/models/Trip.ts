import { DataTypes, Model } from "sequelize";
import sequelize from "../database/sequelize";

// sequelize model definition for the 'Trip' entity
class Trip extends Model {
  declare id: string;
  declare origin: string;
  declare destination: string;
  declare cost: number;
  declare duration: number;
  declare type: string;
  declare display_name: string;
  declare deleted: boolean; // deleted column to use for deleteTrip
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
    modelName: "Trip",
    tableName: "trips",
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    timestamps: true, // adding created_at and updated_at to keep track
    // defaultScope: {
    //   attributes: { exclude: ["deleted"] },
    // },
    // scopes: {
    //   withDeleted: {
    //     attributes: [
    //       "origin",
    //       "destination",
    //       "cost",
    //       "duration",
    //       "type",
    //       "id",
    //       "display_name",
    //       "deleted",
    //     ],
    //   },
    // },
  },
);

export default Trip;
