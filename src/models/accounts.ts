import {Model, Column, DataType, PrimaryKey, Table, CreatedAt, UpdatedAt, Unique, DeletedAt} from "sequelize-typescript";
export { Accounts };

@Table({
    tableName: 'accounts',
    underscored: true,
    paranoid: true
})
class Accounts extends Model {
    @PrimaryKey
    @Column(DataType.UUID)
    id!: string;

    @Column
    name!: string;

    @Unique
    @Column
    username!: string;

    @Unique
    @Column
    mail!: string;

    @Column
    password!: string;

    @CreatedAt
    created_at!: Date;
  
    @UpdatedAt
    updated_at!: Date;
  
    @DeletedAt
    deleted_at!: Date;
}