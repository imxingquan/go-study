package main
import (
    "fmt"
    "net"
    "os"
    //"bufio"  
    "io"  
    "os/exec"
    "log"
    "strings"
    "io/ioutil"
    "bytes"
    "time"
    "encoding/json"
)

type MySqlConfig struct{
    UserName string
    Password string
    Port string
    Database string
}

type Config struct {
    Port string
    BackupFile string
    BufferSize int
    MySql MySqlConfig
}

//全局配置
var config Config

var backupFile string

func checkError(err error){
    if  err != nil {
        fmt.Println("Error: %s", err.Error())
        os.Exit(1)  
    }
}

func backupMysql(conn net.Conn,userName string,password string,port string,database string){
	os.Getenv("PATH")
	command := fmt.Sprintf("cmd /c mysqldump -u%s -p%s -P%s %s > %s",userName,password,port,database,backupFile)
	cmdArgs := strings.Split(command," ")
	cmd := exec.Command(cmdArgs[0],cmdArgs[1:]...)
	//显示运行的命令
	//fmt.Println(cmd.Args)
	
	// stdout, err := cmd.StdoutPipe()
	// if err != nil {
	// 	log.Println(err)
	// 	return
	// }

	if err := cmd.Start(); err != nil {
		log.Println(err)
	}
	
	for {
        f,err := os.Open(backupFile)
        
        if err != nil {
            log.Println("is backup sql now....");
            conn.Write([]byte("is backup sql now...."));
            time.Sleep(5 * time.Second)
        }else {
            f.Close()
            log.Println("backup over! Will send sql file!");
            conn.Write([]byte("backup over! Will send sql file!"));
            break;
        }
	}
   
	if err :=cmd.Wait(); err != nil{
        log.Println(err)
    }

    //备份完毕发送文件给客户端
    sendBackupFile(conn)
    
}

func sendBackupFile(conn net.Conn){
    log.Println("send command #1001")
    conn.Write([]byte("#1001"));

    data,err := ioutil.ReadFile(backupFile)
	if err != nil {
		log.Fatal(err)
    }

    reader := bytes.NewReader(data)
    
    for{
       buf := make([]byte, config.BufferSize)
        n,err2 := reader.Read(buf)
        if err2 == io.EOF {
            log.Printf("file eof= %s",buf[:n])
            break
        }else if err2 != nil {
            log.Fatal(err2)
        }
        //发送等长数据 
        //buf2 := bytes.Trim(buf, "\x00")
        conn.Write(buf[:n])
        log.Printf("send=%d,",n)
    }

    log.Println("send command #1002")
    conn.Write([]byte("#1002"));
}

func recvConnMsg(conn net.Conn) {
	//  var buf [50]byte
		
    buf := make([]byte, config.BufferSize) 
		for {
            
			n, err := conn.Read(buf)
	
			if err != nil {
				fmt.Println("conn closed")
				return  
			}   
	
			cmd := string(buf[0:n]);
            log.Printf("accept command %s len:%d",cmd,len(cmd));

			if cmd == "backup" {
                log.Println("backup database!")
                
                backupMysql(conn,config.MySql.UserName,config.MySql.Password,config.MySql.Port,config.MySql.Database)
                
              
			}else if( cmd == "sxxx"){
                log.Println("send sql");
            
            }
		}   
	}


func loadConfig() Config{
    file,err := os.Open("config.json")
    defer file.Close()
    if err != nil{
        log.Fatal("load config.json error!")
    }

    decoder := json.NewDecoder(file)
    conf := Config{}
    err = decoder.Decode(&conf)
    if err != nil {
        log.Fatal("decode error:",err)
    }

    json_string, err := json.Marshal(conf)
    fmt.Printf("json = %s\n", json_string)

    return conf
}


func main(){
   
    config = loadConfig()

    fmt.Println(config)
    backupFile = config.BackupFile

    fmt.Println(config.MySql.UserName)

	listen_sock, err := net.Listen("tcp", ":"+config.Port)
	checkError(err);
	
    defer listen_sock.Close()
    log.Printf("server is staring... listen port:"+config.Port);

    for {
        new_conn, err := listen_sock.Accept()
        defer new_conn.Close()
        if err != nil {
            fmt.Printf("Error:%s\n",err.Error())
            continue    
        }   
        log.Printf("%s connecting",new_conn.RemoteAddr())
        recvConnMsg(new_conn)
    }

}

