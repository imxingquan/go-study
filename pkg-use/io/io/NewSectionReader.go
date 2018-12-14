// NewSectionReader returns a SectionReader that reads from r
// starting at offset off and stops with EOF after n bytes.
// func NewSectionReader(r ReaderAt, off int64, n int64) *SectionReader

package main

import (
	"io"
	"strings"
	"log"
	"os"
	"fmt"
)

func ExampleNewSectionReader(){
	fmt.Println("\n=============ExampleNewSectionReader()======\n")
	r := strings.NewReader("People are study English")
	//从第11位开始获取7个长度
	s := io.NewSectionReader(r,11,7)

	if _, err := io.Copy(os.Stdout,s); err != nil {
		log.Fatal(err)
	}

	// Output:
	// study E
}


func ExampleNewSectionReader_ReadAt(){
	fmt.Println("\n=============ExampleNewSectionReader_ReadAt()======\n")
	r := strings.NewReader("People*are*study*English")
	//从第11位开始获取7个长度
	s := io.NewSectionReader(r,11,7)

	//ReadAt 将s的内容读入到buf中,偏移1位
	buf := make([]byte,3)
	if _, err := s.ReadAt(buf,1); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n",buf)

	// Output:
	// tud
}

func main() {
	ExampleNewSectionReader()

	ExampleNewSectionReader_ReadAt()
}