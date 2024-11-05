import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";


const webgoat_login_url = "http://localhost:8090/WebGoat/login"
// const webgoat_logout_url = "http://localhost:8090/WebGoat/login"
const webgoat_lessons_url = "http://localhost:8090/WebGoat/service/lessonmenu.mvc"

export async function POST(request : NextRequest) {
  try {
  const username = request.nextUrl.searchParams?.get("username");
  const password = request.nextUrl.searchParams?.get("password");

  if(!username || !password)
    return NextResponse.json(
      {message: "Please give username and password"}, 
      {status: HttpStatusCode.BadRequest});



    const response = await fetch(webgoat_login_url, {
      method: 'POST', 
      redirect: 'manual', 
      body: `username=${username}&password=${password}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    
    console.log("FOUND")
    console.log(response)
    const cookies = response.headers.getSetCookie();
    console.log(`COOKIE ${response.headers.getSetCookie()}`)

    const response2 = await fetch(webgoat_lessons_url, {
      method: 'POST', 
      redirect: 'follow', 
      headers: {
        "Content-Type": "application/application-json",
        "Cookie": cookies[0]
      }
    })


    console.log("FOUND LESSONS")
    console.log(await response2.text())


    return NextResponse.json({
      message: "test"
    })
    
  } catch (ex) {
    return NextResponse.json(
      {
        message: `Error: ${ex}\n`,
      },
      {
        status: HttpStatusCode.InternalServerError,
      }
    );
  }
}

