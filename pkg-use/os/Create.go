package main

import (
	"os"
	"log"
	"strings"
)

func main(){
	dst := os.Args[1]
	
	sp := strings.LastIndex(dst,"/")

	os.MkdirAll(dst[0:sp],os.ModeDir)

	os.Create(dst)
	out, err := os.Create(dst)
    if err != nil {
		log.Printf("4: %s",err)
        return
	}
	defer func() {
        cerr := out.Close()
        if err == nil {
            err = cerr
        }
    }()
}