// MultiReader returns a Reader that's the logical concatenation of
// the provided input readers. They're read sequentially. Once all
// inputs have returned EOF, Read will return EOF.  If any of the readers
// return a non-nil, non-EOF error, Read will return that error.
// func MultiReader(readers ...Reader) Reader

package main

import (
	"log"
	"strings"
	"io"
	"os"
)

func main(){
	r1 := strings.NewReader("Where does Tom live? ")
	r2 := strings.NewReader(" Tom is from Japan")
	r3 := strings.NewReader(" His parters are both teachers")

	r := io.MultiReader(r1,r2,r3)

	if _, err := io.Copy(os.Stdout, r); err != nil {
		log.Fatal(err)
	}

	// Output:
	// Where does Tom live?  Tom is from Japan His parters are both teachers
}