// io.Copy(dst Writer,stc Reader) (written int64,error)
// io.Copy 示例

package main

import (
	"fmt"
	"strings"
	"io"
	"log"
	"os"
	"bytes"
)

func ExampleCopy(){
	fmt.Printf("\n=============ExampleCopy()========\n")

	r := strings.NewReader("将字符串复制到标准输出\n")
	if _, err := io.Copy(os.Stdout,r); err != nil {
		log.Fatal(err)
	}


	//打开文件将内容复制到buffer
	file,err2 := os.Open("../testdata/data.log")
	if err2 != nil {
		log.Fatal(err2)
	}
	var buf = new(bytes.Buffer)
	//Copy 返回copy 数据的长度
	w,err3 := io.Copy(buf,file)
	if err3!=nil {
		log.Fatal(err3)
	}
	fi,_ := file.Stat()
	fmt.Printf("io copy len=%d,file len=%d\n",w,fi.Size())

}

//自定义 copy缓冲区 从缓冲区复制到指定的输出
func ExampleCopyBuffer(){
	fmt.Printf("\n=============ExampleCopyBuffer()========\n")
	r1 := strings.NewReader("Ben is from American\n");
	r2 := strings.NewReader("Ben is from American Lisa is from China\n")
	buf := make([]byte, 1)

	//file,_ := os.Open("../testdata/data.log")

	// buf is used here...
	if _, err := io.CopyBuffer(os.Stdout, r1, buf); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("buf=%s,len=%d\n",buf,len(buf));
	// ... reused here also. No need to allocate an extra buffer.
	if _, err := io.CopyBuffer(os.Stdout, r2, buf); err != nil {
		log.Fatal(err)
	}

	fmt.Printf("buf=%s,len=%d\n",buf,len(buf));
}

//拷贝6 byte到缓冲区
func ExampleCopyN(){
	fmt.Printf("\n=============ExampleCopyN()========\n")
	v := "哈"
	fmt.Printf("一个汉字的长度 = %d\n",len(v))
	
	r := strings.NewReader("一次方程也被称为线性方程，因为在笛卡尔坐标系上任何一个一次方程的表示都是一条直线")
	if _, err := io.CopyN(os.Stdout,r,6); err != nil {
		log.Fatal(err)
	}
}

func main(){
	ExampleCopy()

	ExampleCopyBuffer()

	ExampleCopyN()
}