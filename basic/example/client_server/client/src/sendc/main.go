package main

import (
    "fmt"
    "net"
    "os"
    "bufio"
    "log"
    "bytes"
    "golang.org/x/text/encoding/simplifiedchinese"
    "golang.org/x/text/transform"
    "io/ioutil"
)

func checkError(err error){
    if  err != nil {
        fmt.Println("Error: %s", err.Error())
        os.Exit(1)  
    }
}

func main() {
    conn, err := net.Dial("tcp", "192.168.0.21:3721")
    checkError(err)
    defer conn.Close()  

    running := true
    reader := bufio.NewReader(os.Stdin)
    for running {

         go func(){
             for{
                buf := make([]byte, 1024) 
                length, err := conn.Read(buf)
                if err != nil {
                    log.Printf("Error when read from server.\n")
                    os.Exit(0)
                }
                //GBK解码
                o := transform.NewReader(bytes.NewReader(buf[:length]), simplifiedchinese.GBK.NewDecoder())
                data, err := ioutil.ReadAll(o)
                if err != nil{
                    log.Println(err)
                }
                log.Println(string(data))
             }
         }()
       
        fmt.Println("1:更新服务器代码\n2:生成服务器代码\n3:重启IIS\n4:拜拜")
        data, _, _ := reader.ReadLine()
        command := string(data)
        switch command{
            case "4":
                running = false
            case "3":
                command = `cmd /c iisreset`
                conn.Write([]byte(command))
            case "2":
                command = `cmd /c msbuild.exe C:\内网测试\Source1.2\Source1.2.sln /v:m /t:Rebuild /p:Configuration=Debug /p:platform=x86`
                conn.Write([]byte(command))
            case "1":
                command = `cmd /c svn update C:\\内网测试\\Source1.2\\`
                conn.Write([]byte(command))
            default:
                conn.Write([]byte(command))

        }
              
    }

}