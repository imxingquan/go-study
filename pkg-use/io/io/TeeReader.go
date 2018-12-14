// TeeReader returns a Reader that writes to w what it reads from r.
// All reads from r performed through it are matched with
// corresponding writes to w. There is no internal buffering -
// the write must complete before the read completes.
// Any error encountered while writing is reported as a read error.
// func TeeReader(r Reader, w Writer) Reader

package main

import (
	"strings"
	"io/ioutil"
	"bytes"
	"io"
	"log"
	"fmt"
)

func ExampleTeeReader(){
	r := strings.NewReader("some io.Reader stream to be read\n")
	var buf bytes.Buffer
	tee := io.TeeReader(r,&buf)

	printall := func(r io.Reader){
		b, err := ioutil.ReadAll(r)
		if err != nil {
			log.Fatal(err)
		}

		fmt.Printf("%s",b)
	}

	printall(tee)
	printall(&buf)
}
func main(){
	ExampleTeeReader()
}