package main
// ioutil.ReadAll 读取读取所有内容
//
import (
	"fmt"
	"io/ioutil"
	"log"
	"strings"
	"os"
	"io"
	"bytes"
)

func ExampleReadAll(){
	r := strings.NewReader("Go is a 非常好用的语言")

	b, err := ioutil.ReadAll(r)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("%s",b)
}

//ReadAll 读取大文件
func ExampleReadAll_2(){
	file,err := os.Open("data.log")
	if err != nil {
		log.Panicf("failed 读取文件")
	}
	defer file.Close()

	data, err := ioutil.ReadAll(file)
	fmt.Printf("\nData: %s",data)
	fmt.Printf("\nLength: %d bytes",len(data))
	fmt.Printf("\nError: %v",err)
}


func main(){
	ExampleReadAll()
	ExampleReadAll_2()
	
	fmt.Printf("========分析ReadAll============\n")
	file,_ := os.Open("ReadAll.go")
	data,_ :=ReadAll(file)
	fmt.Printf("\nLength:%d bytes",len(data))
	//fmt.Printf("\nData:%s",data)
}

func readAll(r io.Reader, capacity int64) (b []byte, err error) {
	var buf bytes.Buffer
	// If the buffer overflows, we will get bytes.ErrTooLarge.
	// Return that as an error. Any other panic remains.
	defer func() {
		e := recover()
		if e == nil {
			return
		}
		if panicErr, ok := e.(error); ok && panicErr == bytes.ErrTooLarge {
			err = panicErr
		} else {
			panic(e)
		}
	}()

	fmt.Printf("[DEBUG] int64(int(capacity))=%d,capacity=%d\n",int64(int(capacity)),capacity)
	fmt.Printf("[DEBUG] buf.len=%d,buf.cap=%d\n",buf.Len(),buf.Cap())
	
	if int64(int(capacity)) == capacity {
		buf.Grow(int(capacity))
		fmt.Printf("[DEBUG] after buf.Grow()  buf.len=%d,buf.cap=%d\n",buf.Len(),buf.Cap())

	}
	_, err = buf.ReadFrom(r)

	fmt.Printf("[DEBUG] buf.len=%d,buf.cap=%d\n",buf.Len(),buf.Cap())

	return buf.Bytes(), err
}


// ReadAll reads from r until an error or EOF and returns the data it read.
// A successful call returns err == nil, not err == EOF. Because ReadAll is
// defined to read from src until EOF, it does not treat an EOF from Read
// as an error to be reported.
func ReadAll(r io.Reader) ([]byte, error) {
	return readAll(r, bytes.MinRead)
}