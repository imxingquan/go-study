// ioutil.ReadFull(r Reader, buf []byte) (n int, err error)

package main

import (
	"fmt"
	"log"
	"os"
	"io"
)
func main(){

	file,_ := os.Open("../testdata/data.log")

	//读入50个字节内容
	buf := make([]byte,50)
	if _, err := io.ReadFull(file,buf);err != nil{
		log.Fatal(err)
	}

	fmt.Printf("buf=%s\n",buf)
}