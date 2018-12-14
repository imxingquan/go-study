// MultiWriter creates a writer that duplicates its writes to all the
// provided writers, similar to the Unix tee(1) command.
//
// Each write is written to each listed writer, one at a time.
// If a listed writer returns an error, that overall write operation
// stops and returns the error; it does not continue down the list.
//func MultiWriter(writers ...Writer) Writer

package main

import (
	"strings"
	"io"
	"fmt"
	"bytes"
	"log"
)

func ExampleMultiWriter(){
	fmt.Println("\n============ExampleMultiWriter==========\n")

	r := strings.NewReader("I can speak several languages.\n")

	var buf1, buf2 bytes.Buffer
	w := io.MultiWriter(&buf1,&buf2)

	if _, err := io.Copy(w,r); err != nil {
		log.Fatal(err)
	}
	fmt.Print(buf1.String())
	fmt.Print(buf2.String())

	// Output:
	// I can speak several languages.
	// I can speak several languages.
}

func ExamplePipe() {
	r, w := io.Pipe()

	go func() {
		fmt.Fprint(w, "some text to be read\n")
		w.Close()
	}()

	buf := new(bytes.Buffer)
	buf.ReadFrom(r)
	fmt.Print(buf.String())

	// Output:
	// some text to be read
}

func main(){
	ExampleMultiWriter()

	ExamplePipe()
}