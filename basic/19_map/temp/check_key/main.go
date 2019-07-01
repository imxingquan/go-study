package main

import "fmt"

func main(){

    var map1 = make(map[string]string)

    map1["Tim"] = "Good morinig"
    map1["Jeeny"] = "Bonjour"

	fmt.Println(map1)
	
	r,ok:= map1["hi"]
	fmt.Println(r,ok)
	
}