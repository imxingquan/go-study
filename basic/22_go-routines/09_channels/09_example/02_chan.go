
package main

import (
	"fmt"
	"time"
)

func main(){

	//没有缓冲区的通道
	var strChan = make(chan string,0)
	var syncChan = make(chan struct{},1)
	go func(){
		fmt.Println("ready recive... ")
		
		for{
			if elem, ok := <-strChan; ok{
				fmt.Println("Recived:",elem,"[reciver]")
			}else{
				break
			}
		}
	}()
	
	go func(){
		
		<-syncChan

		fmt.Println("recive c sign")
	}()
	go func(){
		fmt.Println("ready sender...")
		
		for _, elem := range []string{"a","b","c","d"}{
			strChan <- elem
			fmt.Println("Send:",elem,"[sender]")

			if elem == "c" {
				syncChan <- struct{}{}
				fmt.Println("send c sign")
			}
		}
		
		//fmt.Println("Wait 2 seconds...[sender]")
		//time.Sleep(time.Second * 2)
		close(strChan)
	}()

	time.Sleep(time.Second * 5)
}