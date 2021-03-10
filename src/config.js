function getTypoOptions(disabled) {
    return {
        fontSize: {
            options: {
                disabled,
            },
        },
        fontFamily: {
            options: {
                disabled,
            },
        },
        fontWeight: {
            options: {
                disabled,
            },
        },
        lineHeight: {
            options: {
                disabled,
            },
        },
    };
}

export function getConfig(content) {
    return {
        styleOptions: {
            ...getTypoOptions(!!content.font),
            textAlign: {
                type: 'TextRadioGroup',
                options: {
                    choices: [
                        {
                            value: 'left',
                            default: true,
                            title: { en: 'Left', fr: 'Gauche' },
                            icon: 'text-align-left',
                        },
                        { value: 'center', title: { en: 'Center', fr: 'Milieu' }, icon: 'text-align-center' },
                        { value: 'right', title: { en: 'Right', fr: 'Droite' }, icon: 'text-align-right' },
                        {
                            value: 'justify',
                            title: { en: 'Justify', fr: 'Justifié' },
                            icon: 'text-align-justify',
                        },
                    ],
                },
                label: {
                    en: 'Alignement',
                    fr: 'Alignement',
                },
            },
            color: {
                type: 'Color',
                label: {
                    en: 'Text color',
                    fr: 'Couleur du texte',
                },
                bindable: true,
                options: {
                    nullable: true,
                },
            },
            backgroundColor: {
                type: 'Color',
                label: {
                    en: 'Text Background',
                    fr: 'Background du Texte',
                },
                bindable: true,
                options: {
                    nullable: true,
                },
            },
            textTransform: {
                label: {
                    en: 'Character case',
                    fr: 'Character case',
                },
                type: 'TextSelect',
                options: {
                    options: [
                        { value: null, label: 'none' },
                        { value: 'capitalize', label: 'capitalize' },
                        { value: 'uppercase', label: 'uppercase' },
                        { value: 'lowercase', label: 'lowercase' },
                    ],
                },
            },
            textShadow: {
                label: {
                    en: 'Text Shadows',
                    fr: 'Ombres du texte',
                },
                type: 'Shadows',
                options: {
                    isText: true,
                },
            },
            wordSpacing: {
                label: {
                    en: 'Word spacing',
                    fr: 'Espacement des mots',
                },
                type: 'Length',
                options: {
                    unitChoices: [{ value: 'px', label: 'px', min: 0, max: 100 }],
                },
            },
        },
    };
}
