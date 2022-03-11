import React, { useEffect, useRef, useState } from "react";
import Router from "next/router";
import { PostProps } from "../../../components/Post";
import prisma from '../../../lib/prisma'
import { getCsrfToken, getSession, useSession } from "next-auth/react";
import { Container, Avatar, Card, Box, Grid } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { Button, TextareaAutosize, TextField, Typography, FormGroup } from "@material-ui/core";
import useRequest from "../../../hooks/useRequest";
import models from "../../../lib/models";


const PostEdit = ({ csrfToken= null, session = null, post }) => {
  
  const { isLoading: isLoading, serverError: serverError, doFetch: doFetch } = useRequest("PUT",`post/${post.id}` );

  const formRef = useRef(null);

  if (session && post) {
    
    
    const submitData = async (e: React.SyntheticEvent) => {
      e.preventDefault();
      const {
        title,
        content,
        city,
        price
      } = formRef.current;
  
      const saveData = {title: title.value, content: content.value, city: city.value, price:parseInt(price.value), authorId: session.user.id}
  
      doFetch(saveData)
        
    };
    return (
      <Box sx={{mt: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
      <h1>Modifier mon annonce </h1>
      <form ref={formRef}>
        <FormGroup sx={{mt: 4, display:'flex', flexDirection: 'column'}}  >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <TextField label="Titre" type="title" id="title" name="title" sx={{mt:3}} defaultValue={post.title}/>
          <Typography sx={{mt:3}}>Description</Typography>
          <TextareaAutosize minRows={6} id="content" name="content" defaultValue={post.content}/>
          <TextField label="Ville" type="city" id="city" name="city" sx={{mt:3}} defaultValue={post.city} />
          <TextField label="Prix" type="price" id="price" name="price" sx={{mt:3}} defaultValue={post.price}/>
          <Button sx={{mt: 2}} type="submit"onClick={(e) => submitData(e)} >Enregistrer</Button>
        </FormGroup>  
      </form>
    </Box>
    )
  }
};

export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  const session = await getSession(context)
  const postId = context.params?.id
  const post = await models.post.findUnique({ where: { id: parseInt(postId) } });

  console.log(context.params?.id, "-------------")

  return {
    props: { csrfToken, session, post },
  }
}

export default PostEdit