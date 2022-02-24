import { QueryInterface, SequelizeStatic } from "sequelize";

const photos = "Photos";

export = {
  async up(
    queryInterface: QueryInterface,
    sequelize: SequelizeStatic
  ): Promise<void> {
    return queryInterface.createTable(photos, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: sequelize.UUID,
        defaultValue: sequelize.UUIDV4
      },
      createdAt: {
        type: sequelize.DATE,
        defaultValue: sequelize.fn("NOW")
      },
      photos: {
        allowNull: false,
        unique: true,
        type: sequelize.STRING
      },
      updatedAt: {
        allowNull: false,
        type: sequelize.DATE
      }
    });
  },

  down(queryInterface: QueryInterface): Promise<void> {
    return queryInterface.dropTable(photos);
  }
};
