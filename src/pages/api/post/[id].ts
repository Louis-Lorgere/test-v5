import { getSession } from 'next-auth/react';

import type { NextApiRequest, NextApiResponse } from 'next'
import type { Prisma } from "@prisma/client"
import models from '../../../lib/models';

// DELETE /api/post/:id
// export default async function handle(req: NextApiRequest, res: NextApiResponse) {
//   const postId = req.query.id;

//   const session = await getSession({ req })

//   if (req.method === "DELETE") {
//     if (session) {
//       const post = await prisma.post.delete({
//         where: { id: Number(postId) },
//       });
//       res.json(post);
//     } else {
//       res.status(401).send({ message: 'Unauthorized' })
//     }
//   } else {
//     throw new Error(
//       `The HTTP ${req.method} method is not supported at this route.`
//     );
//   }
// }

const getONE = async (postId, response) => {
  try {
    const result = await models.post.findUnique({
      where: {
        id: postId,
      },
    })
    response.status(200).json(result);
  } catch (err) {
    console.log(err);
    response.status(404).json({ err: "Posts not found" });
  }
}

const deleteONE = async (postId, response) => {
  try {
    const result = await models.post.delete({
      where: { id: Number(postId) }
    })
    response.status(200).json(result);
  } catch (err) {
    console.log(err);
    response.status(404).json({ err: "Posts not found" });
  }
}

const updateONE = async (body, postId, response) => {
  const data: Prisma.PostCreateInput = { 
    title: body.title,
    content: body.content || null,
    price: body.price,
    city: body.city,
    published: body.published || false,
    author: undefined
  };
  console.log("----------", postId)
  console.log("----------", body)
  try {
    const result = await models.post.update({
      where: {
        id: postId,
      },
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
  const {method, query, body } = request;
  const postId = Number(query.id);

  if (method === 'GET') {
    getONE(postId, response)
    
    return
  }

  if (method === 'DELETE') {
    deleteONE(postId, response)

    return
  }

  if (method === 'PUT') {
    updateONE(body, postId, response)

    return
  }


};
