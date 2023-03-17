/* eslint-disable */
import type { Prisma, User, Product } from "@prisma/client";
export default interface PrismaTypes {
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        RelationName: "products";
        ListRelations: "products";
        Relations: {
            products: {
                Shape: Product[];
                Types: PrismaTypes["Product"];
            };
        };
    };
    Product: {
        Name: "Product";
        Shape: Product;
        Include: Prisma.ProductInclude;
        Select: Prisma.ProductSelect;
        OrderBy: Prisma.ProductOrderByWithRelationInput;
        WhereUnique: Prisma.ProductWhereUniqueInput;
        Where: Prisma.ProductWhereInput;
        RelationName: "owner";
        ListRelations: never;
        Relations: {
            owner: {
                Shape: User;
                Types: PrismaTypes["User"];
            };
        };
    };
}