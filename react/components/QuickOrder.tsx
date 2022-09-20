import React, { useState, useEffect } from "react";
import { useMutation, useLazyQuery } from "react-apollo";
import UPDATE_CART from "../graphql/updateCart.graphql"
import GET_PRODUCT from "../graphql/getProductBySku.graphql"

const QuickOrder = () => {
  const [inputText, setInputText] = useState("");
  const [search, setSearch] = useState("")

  const [getProductData, { data: product }] = useLazyQuery(GET_PRODUCT)
  const [addToCart] = useMutation(UPDATE_CART)

  const handleChange = (evt: any) => {
    setInputText(evt.target.value)
    console.log("input changed", inputText)
  }

  useEffect(() => {
    console.log("El resultado de mi producto es:", product, search)
    if (!product) {
      alert("Producto no encontrado")
    } else {
      let skuId = parseInt(inputText)
      console.log("mis datos necesarios son:", skuId, product)
      addToCart({
        variables: {
          salesChannel: "1",
          items: [
            {
              id: skuId,
              quantity: 1,
              seller: "1"
            }
          ]
        }
      })
        .then(() => {
          window.location.href = "/checkout"
        })
    }
  }, [product, search])

  const addProductToCart = () => {
    getProductData({
      variables: {
        sku: inputText
      }
    })
  }

  const searchProduct = (evt: any) => {
    evt.preventDefault();
    if (!inputText) {
      alert("Debes ingresar un producto")
    } else {
      console.log("al final estamos buscando:", inputText)
      setSearch(inputText)
      addProductToCart()

    }
  }

  return <div>
    <h2>Compra rapida</h2>
    <form onSubmit={searchProduct}>
      <div>
        <label htmlFor="sku">Ingresa el numero de SKU</label>
        <input id="sku" type="text" onChange={handleChange}></input>
      </div>
      <input type="submit" value="añadir al carrito" />
    </form>
  </div>
}

export default QuickOrder