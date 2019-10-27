package main

import (
	"fmt"

	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/mysql"
)

type Result struct {
	ID      string
	Caption string
	Stdid   string
	Chapter string
	Content string
}

func (Result) TableName() string {
	return "st_bookcontent"
}

func main() {
	db, err := gorm.Open("mysql", "root:root@(127.0.0.1)/censorstandarddb?charset=utf8&parseTime=True&loc=Local")
	if err != nil {
		panic("failed to connect database")
	}
	defer db.Close()
	db.LogMode(true)
	//db.AutoMigrate(&Result{})

	var lst []Result
	db.Where("content LIKE ?", "%消防设计%").Find(&lst)

	fmt.Println(lst)

	var d1 Result
	db.First(&d1)
	fmt.Println(d1)
}
