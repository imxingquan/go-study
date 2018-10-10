package main

import (
    "fmt"
    "net"
    "os"
    "bufio"  
    "io"  
    "os/exec"
    "log"
    "strings"
    "golang.org/x/text/encoding/simplifiedchinese"
    "golang.org/x/text/transform"
    "io/ioutil"
    "bytes"
)

func execCommand(conn net.Conn,commandName string, params []string) bool {
    os.Getenv("PATH")
	cmd := exec.Command(commandName, params...)
	//显示运行的命令
	fmt.Printf("cmd:%s  args:%s\n",commandName,cmd.Args)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		log.Println(err)
		return false
	}
	
	if err := cmd.Start(); err != nil {
		log.Println(err)
	}

	reader := bufio.NewReader(stdout)
    //full_out_line := fmt.Sprintf("cmd:%s  args:%s\n",commandName,cmd.Args)

    //var full_out_byte = make([]byte,0,10)
    var full_byte []byte
    //full_byte = append(full_byte,[]byte(cmd.Args)...)

	for {
        /*
		line, err2 := reader.ReadString('\n')
		if err2 != nil || io.EOF == err2 {
            log.Println(err2)
			break
		}
        log.Println(line)
        full_out_line = line + "\n"
        */

        line_byte,err3 := reader.ReadBytes('\n')
        if err3 != nil || io.EOF == err3{
            break;
        }
        full_byte = append(full_byte,line_byte...)

        StdoutGBK(line_byte)
        //发送到客户端
        conn.Write(line_byte)
	}
   
    

	if err :=cmd.Wait(); err != nil{
        log.Println(err)
    }
	return true
}

func StdoutGBK(buf []byte){
    o := transform.NewReader(bytes.NewReader(buf), simplifiedchinese.GBK.NewDecoder())
    data, err := ioutil.ReadAll(o)
    if err != nil{
        log.Println(err)
    }
    log.Println(string(data))
}

func recvConnMsg(conn net.Conn) {
//  var buf [50]byte
    buf := make([]byte, 1024) 

    defer conn.Close()

    for {
        n, err := conn.Read(buf)

        if err != nil {
            fmt.Println("conn closed")
            return  
        }   

        cmd := string(buf[0:n]);
        
        cmdArgs := strings.Split(cmd," ")
        execCommand(conn,cmdArgs[0],cmdArgs[1:])
    }   
}

func main() {
    listen_sock, err := net.Listen("tcp", ":3721")
    if  err != nil {
        fmt.Printf("Error: %s\n", err.Error())
        os.Exit(1)  
    }
    defer listen_sock.Close()

    for {
        new_conn, err := listen_sock.Accept()
        if err != nil {
            fmt.Printf("Error:%s\n",err.Error())
            continue    
        }   

        go recvConnMsg(new_conn)
    }

}