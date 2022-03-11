import { Button, FormGroup, TextareaAutosize, TextField, Typography } from "@material-ui/core"
import { Box } from "@mui/system"
import { getCsrfToken, getSession } from "next-auth/react"
import { useRef, useState } from "react"

import type { Post } from "@prisma/client"
import useRequest from "../../hooks/useRequest"

const CreatePost = ({csrfToken, session}) => {
  const formRef = useRef(null);
  const { isLoading, serverError, doFetch } = useRequest(
    "POST",
    "post"
  );
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
      <h1>Créer une nouvelle annonce </h1>
      <form ref={formRef}>
        <FormGroup sx={{mt: 4, display:'flex', flexDirection: 'column'}}  >
          <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
          <TextField label="Titre" type="title" id="title" name="title" sx={{mt:3}}/>
          <Typography sx={{mt:3}}>Description</Typography>
          <TextareaAutosize minRows={6} id="content" name="content"/>
          <TextField label="Ville" type="city" id="city" name="city" sx={{mt:3}}/>
          <TextField label="Prix" type="price" id="price" name="price" sx={{mt:3}}/>
          <Button sx={{mt: 2}} type="submit"onClick={(e) => submitData(e)} >Enregistrer</Button>
        </FormGroup>  
      </form>
    </Box>
  )
}


export async function getServerSideProps(context) {
  const csrfToken = await getCsrfToken(context)
  const session = await getSession(context)

  if (!session ) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  if (session){
    return {
      props: { csrfToken, session },
    }
  }
}

export default CreatePost