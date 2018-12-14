// LimitReader returns a Reader that reads from r
// but stops with EOF after n bytes.
// The underlying implementation is a *LimitedReader.
// func LimitReader(r Reader, n int64) Reader

package main

import (
	"fmt"
	"io"
	//"log"
	"strings"
	//"os"
)

// 读个字节的数据
func ExampleLimitReader(){
	r := strings.NewReader("Jackson comes from the US")
	//读入4个字节的数据
	lr := io.LimitReader(r,4)
	//将数据copy到标准输出
	/*
	if _, err := io.Copy(os.Stdout,lr); err != nil{
		log.Fatal(err)
	}*/

	
	buf := make([]byte,3)
	n,_ := lr.Read(buf)
	fmt.Printf("\nn=%d,buf=%s",n,buf)
/* 
	output:
	  n=3,buf=Jac
	*/
}

func main(){
	ExampleLimitReader()
}