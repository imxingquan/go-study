package main

import (
	"bufio"
	//"bytes"
	"fmt"
	//"golang.org/x/text/encoding/simplifiedchinese"
	//"golang.org/x/text/transform"
	//"io/ioutil"
	//"io"
	"log"
	"net"
	"os"
	"os/exec"
	"strings"
	"encoding/json"
)
type MySqlConfig struct{
    UserName string
    Password string
    Port string
    Database string
}
type Config struct{
	RemoteIp string
	ImportFile string
	BufferSize int
	MySql MySqlConfig
}
//全局配置
var config Config

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

	/*
    json_string, err := json.Marshal(conf)
    fmt.Printf("json = %s\n", json_string)
	*/
    return conf
}


func checkError(err error) {
	if err != nil {
		fmt.Println("Error: %s", err.Error())
		os.Exit(1)
	}
}

var file *os.File
var startWriteFile bool

func main() {
	config = loadConfig()

	conn, err := net.Dial("tcp", config.RemoteIp)
	checkError(err)
	defer conn.Close()
	log.Println("connecting server :" + config.RemoteIp);

	running := true
	reader := bufio.NewReader(os.Stdin)

	// go func(){
	// 	for{
	// 	   buf := make([]byte, 2*1024)
	// 	   n, err := conn.Read(buf)
	// 	   if err != nil {
	// 		   log.Printf("Error when read from server.\n")
	// 		   os.Exit(0)
	// 	   }
	// 	   cmd := string(buf[0:n]);
	// 	   log.Printf("accept command %s len:%d",cmd,len(cmd));
	// 	   if cmd == "--file_end"{
	// 			startWriteFile=false
	// 	   }
	// 	}
	// }()

	for running {

		fmt.Println("1:下载数据库\n2:导入数据库\n3:退出!")
		data, _, _ := reader.ReadLine()
		command := string(data)
		switch command {
		case "3":
			running = false
		case "2":
			importMysql()
		case "1":
			command = "backup"
			conn.Write([]byte(command))
			recvFile(conn)
		default:
			conn.Write([]byte(command))
		}

	}

}

func recvFile(conn net.Conn) {
	
	for {
		buf := make([]byte, config.BufferSize)
		length, err := conn.Read(buf)
		fmt.Printf("buf=%s,length=%d\n",string(buf[0:5]),length)
		if err != nil {
			log.Printf("Error when read from server.\n")
			os.Exit(0)
		}
		/*GBK解码
		   o := transform.NewReader(bytes.NewReader(buf[:length]), simplifiedchinese.GBK.NewDecoder())
		   data, err := ioutil.ReadAll(o)
		   if err != nil{
			   log.Println(err)
		   }*/
		cmd := string(buf[0:5])
		 
		if length != config.BufferSize {
			fmt.Printf("not full data=%s\n", buf[:length])
			cmd = string(buf[length-5:length]);
			fmt.Printf("last 5 cmd=%s",cmd)
		}

		
		
		if cmd == "#1001" {
			//准备写入文件
			log.Println("accept #1001")
			startWriteFile = true
			file, err = os.Create(config.ImportFile)
			checkError(err)
			continue
		} else if cmd == "#1002" {
			log.Println("accept #1002")
			startWriteFile = false
			file.Close()
			log.Printf("download finished!%d\n",length)
			break
		} else if !startWriteFile {
			//log.Printf("accept command %s len:%d",buf[:length],len(buf[:length]));
		}

		if startWriteFile {
		
				n2, err := file.Write(buf[:length])
				if err != nil{
					log.Fatal(err)
				}
				log.Printf("accept=%d,", n2)
			
		
		}
	}

}

func removeEnterChar(s string) string {
	return s[:len(s)-2]
}
func importMysql() {
	/*
	reader := bufio.NewReader(os.Stdin)
	fmt.Println("请输入数据库用户名:")
	userName, _ := reader.ReadString('\n')

	fmt.Println("请输入密码:")
	passwd, _ := reader.ReadString('\n')

	fmt.Println("请输入端口号:")
	port, _ := reader.ReadString('\n')

	fmt.Println("请输入要导入的数据库名称:")
	dbName, _ := reader.ReadString('\n')

	userName = removeEnterChar(userName)
	passwd = removeEnterChar(passwd)
	port = removeEnterChar(port)
	dbName = removeEnterChar(dbName)
	*/
	userName := config.MySql.UserName
	passwd := config.MySql.Password
	port := config.MySql.Port
	dbName := config.MySql.Database
	importFile := config.ImportFile
	fmt.Printf("username=%s,password=%s,port=%s,dbName=%s\n", userName, passwd, port, dbName)

	os.Getenv("PATH")
	command := fmt.Sprintf("cmd /c mysql -u%s -p%s -P%s %s < %s",
		userName, passwd, port, dbName,importFile)

	cmdArgs := strings.Split(command, " ")
	cmd := exec.Command(cmdArgs[0], cmdArgs[1:]...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	log.Printf("%s\n正在导入数据...", command)

	if err := cmd.Run(); err != nil {
		log.Println(err)
		log.Println("导入失败!")
	} else {
		log.Println("导入成功!")
	}

	//GBK解码
	/*
		stdoutbuf, _ := ioutil.ReadAll(stdoutReader)
		o := transform.NewReader(bytes.NewReader(stdoutbuf), simplifiedchinese.GBK.NewDecoder())
		data, err := ioutil.ReadAll(o)

		log.Println("output:", string(data))
	*/
}
