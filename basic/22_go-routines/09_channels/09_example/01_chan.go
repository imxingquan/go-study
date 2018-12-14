
package main

import (
	"fmt"
	"time"

)
//定义3个缓存容量的string通道
var strChan = make(chan string, 3)

func main(){
	syncChan1 := make(chan struct{},1)
	syncChan2 := make(chan struct{},2)

	//接收通道的值
	go func(){
		<-syncChan1
		fmt.Println("Recived a sync signal and wait")
		time.Sleep(time.Second)
		for{
			if elem, ok := <-strChan; ok{
				fmt.Println("Received:",elem,"[receiver]")
			}else{
				break
			}
		}
		fmt.Println("Stopped.[receiver]")
		syncChan2 <- struct{}{}
	}()

	// 发送通道的值
	go func(){
		for _, elem := range []string{"a","b","c","d"}{
			strChan <-elem
			fmt.Println("Sent:",elem,"[sender]")
			if elem == "c" {
				syncChan1 <- struct{}{}
				fmt.Println("Send a sync signal. [sender]")
			}
		}
		fmt.Println("Wait 2 seconds...[sender]")
		time.Sleep(time.Second*2)
		close(strChan)
		syncChan2 <- struct{}{}
	}()
	<-syncChan2
	<-syncChan2
}