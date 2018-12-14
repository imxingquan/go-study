// io.ReadAtLeast(r Reader, buf []byte, min int) (n int, err error)
// 从r里读到buf最后min个字节

package main

import (
	"fmt"
	//"strings"
	"log"
	"io"
	"os"
)

func main(){

	file,_ := os.Open("d:/迅雷下载/ubuntu-18.04-desktop-amd64.iso")

	//r := strings.NewReader("一次方程也被称为线性方程，因为在笛卡尔坐标系上任何一个一次方程的表示都是一条直线")
	
	buf := make([]byte,1024*1024)
	if _, err := ReadAtLeast2(file,buf,1024);err != nil{
		log.Fatal(err)
	}

	//fmt.Printf("%s\n",buf)
}

func ReadAtLeast2(r io.Reader, buf []byte, min int) (n int, err error) {
	if len(buf) < min {
		return 0, io.ErrShortBuffer
	}
	fmt.Printf("begin n=%d\n",n)
	for n < min && err == nil {
		var nn int
		nn, err = r.Read(buf[n:])
		fmt.Printf("read buf[n:] nn=%d\n",nn)
		//fmt.Printf("buf[n:]=%s\n",buf[n:])
		n += nn
		
	}
	if n >= min {
		err = nil
	} else if n > 0 && err == io.EOF {
		err = io.ErrUnexpectedEOF
	}
	return
}