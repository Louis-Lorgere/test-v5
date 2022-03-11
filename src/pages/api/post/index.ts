// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import models from "../../../lib/models";
import { getSession } from "next-auth/react";

import type { Prisma } from "@prisma/client"
import type { NextApiRequest, NextApiResponse } from "next";

const getALL = async (response) => {
  try {
    const result = await models.post.findMany()
    response.status(200).json(result);
  } catch (err) {
    console.log(err);
    response.status(404).json({ err: "Posts not found" });
  }
}

const create = async (body, response) => {
  const data: Prisma.PostCreateInput = { 
    title: body.title,
    content: body.content || null,
    price: body.price,
    city: body.city,
    published: body.published || false,
    author: body.authorId ? {connect: {id: body.authorId}} : null
  };
  try {
    const result = await models.post.create({
      data: {
        ...data,
      },
    });
    response.status(200).json(result);
  } catch (err) {
    console.log(err);
    response.status(403).json({ err: "Error occured while adding a new post." });
  }
}

export default async (request: NextApiRequest, response: NextApiResponse) => {
  const {body, method, query } = request;
  // console.log(query)
  if (method === 'GET') {
    getALL(response)
    
    return
  }
  
  const session = await getSession({ req: request })
  
  if (!session) {
    response.status(401).json({err: "unauthorized"});
    return 
  }

  if (method === 'POST') {
    create(body, response)

    return
  }


};
