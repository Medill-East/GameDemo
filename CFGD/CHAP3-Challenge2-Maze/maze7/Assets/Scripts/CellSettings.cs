using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using TMPro;

public class CellSettings : MonoBehaviour
{
    public TMP_Text indexText;

    public bool isCurrentRound = false;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

    public void SetIndex(int input)
    {
        indexText.text = input.ToString();
    }

    public void IsCurrentRound()
    {
        isCurrentRound = true;
        indexText.fontStyle = FontStyles.Underline;
    }

    public void IsNotCurrentRound()
    {
        isCurrentRound = false;
        indexText.fontStyle = FontStyles.Normal;
    }
}
