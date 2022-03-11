import React, { useEffect, useState } from "react";
import { Avatar, Grid, Typography, Card } from "@material-ui/core";
import Link from "next/link";

import type { Post} from "@prisma/client"
import { useSession } from "next-auth/react";
interface Props {
  testimonial: Post;
}

export default function TestimonialBlock({ testimonial }): JSX.Element {
  
  const { data: session, status } = useSession()
  const [linkEdit, setLinkEdit] = useState(null);

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.id === testimonial.authorId){
        setLinkEdit(<Link href={`/p/${testimonial.id}/edit`}>Edit</Link>)
      }
    }
  }, [])

  


  return (
    <Grid item xs={12} sm={6} md={4}>
      <Link href={`/p/${testimonial.id}`}>
        <Card variant="outlined" sx={{ height: "100%", p: 2 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 1 }}>
          {linkEdit}
            {/* {testimonial.image !== undefined ? (
              <Grid item>
                <Avatar
                  variant="circular"
                  alt={testimonial.title}
                  src={testimonial.image}
                />
              </Grid>
            ) : null} */}

            <Grid item xs>
              <Typography variant="h4">{testimonial.title}</Typography>
              <Typography variant="caption">{testimonial.price} € à {testimonial.city}</Typography>
            </Grid>
          </Grid>
          <Typography variant="body2">{testimonial.content}</Typography>
        </Card>
      </Link>
    </Grid>
  );
}