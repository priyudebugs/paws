; Assisted installer pages for Paws: welcome, options (desktop shortcut, start at sign-in), finish.
!include nsDialogs.nsh
!include LogicLib.nsh

!ifndef BUILD_UNINSTALLER
  Var PawsDesktopBox
  Var PawsStartupBox
  Var PawsDesktop
  Var PawsStartup
!else
  Var PawsWipeBox
  Var PawsWipe
!endif

!macro customInit
  StrCpy $PawsDesktop ${BST_CHECKED}
  StrCpy $PawsStartup ${BST_CHECKED}
!macroend

!macro customWelcomePage
  !define MUI_WELCOMEPAGE_TITLE "Welcome to Paws"
  !define MUI_WELCOMEPAGE_TEXT "Paws is a friendly break buddy with a dog who cares about your back.$\r$\n$\r$\nIt reminds you to rest your eyes, drink water, stretch and take a walk, and it never needs admin rights.$\r$\n$\r$\nMade with love by Priyu."
  !insertmacro MUI_PAGE_WELCOME
!macroend

; The page functions live here because the MUI helpers only exist once the page list is being built.
!macro customPageAfterChangeDir
  Page custom PawsOptionsShow PawsOptionsLeave

  Function PawsOptionsShow
    !insertmacro MUI_HEADER_TEXT "Set up Paws" "Choose how Paws fits into your day."
    nsDialogs::Create 1018
    Pop $0
    ${NSD_CreateCheckbox} 0 8u 100% 12u "Create a desktop shortcut"
    Pop $PawsDesktopBox
    ${NSD_SetState} $PawsDesktopBox $PawsDesktop
    ${NSD_CreateCheckbox} 0 30u 100% 12u "Start Paws when I sign in to Windows (recommended)"
    Pop $PawsStartupBox
    ${NSD_SetState} $PawsStartupBox $PawsStartup
    ${NSD_CreateLabel} 0 58u 100% 30u "Paws runs quietly in the system tray and only appears when it is time for a break. You can change both of these later in Paws settings."
    Pop $0
    nsDialogs::Show
  FunctionEnd

  Function PawsOptionsLeave
    ${NSD_GetState} $PawsDesktopBox $PawsDesktop
    ${NSD_GetState} $PawsStartupBox $PawsStartup
  FunctionEnd
!macroend

!macro customFinishPage
  Function PawsLaunch
    Exec '"$INSTDIR\${APP_EXECUTABLE_FILENAME}"'
  FunctionEnd

  !define MUI_FINISHPAGE_TITLE "Paws is ready"
  !define MUI_FINISHPAGE_TEXT "Look for the dog in your system tray, next to the clock. Paws will show you a quick intro the first time it opens.$\r$\n$\r$\nMade with love by Priyu."
  !define MUI_FINISHPAGE_RUN
  !define MUI_FINISHPAGE_RUN_TEXT "Open Paws now"
  !define MUI_FINISHPAGE_RUN_FUNCTION "PawsLaunch"
  !insertmacro MUI_PAGE_FINISH
!macroend

; Apply the choices from the options page. Updates keep whatever the user already has.
!macro customInstall
  ${ifNot} ${isUpdated}
    ${if} $PawsDesktop == ${BST_CHECKED}
      CreateShortCut "$DESKTOP\Paws.lnk" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
    ${else}
      Delete "$DESKTOP\Paws.lnk"
    ${endIf}
    CreateDirectory "$APPDATA\Paws"
    FileOpen $0 "$APPDATA\Paws\install-choices.json" w
    ${if} $PawsStartup == ${BST_CHECKED}
      FileWrite $0 '{"launchAtLogin": true}'
    ${else}
      FileWrite $0 '{"launchAtLogin": false}'
    ${endIf}
    FileClose $0
  ${endIf}
!macroend

; Uninstall page: keep settings by default, offer a clean slate. A silent uninstall never deletes them.
!macro customUnWelcomePage
  UninstPage custom un.PawsWipeShow un.PawsWipeLeave

  Function un.PawsWipeShow
    !insertmacro MUI_HEADER_TEXT "Uninstall Paws" "Do you want to keep your settings?"
    nsDialogs::Create 1018
    Pop $0
    ${NSD_CreateLabel} 0 0 100% 36u "Paws will be removed from this PC. Your settings, names and streak are kept by default, so they come back if you install Paws again."
    Pop $0
    ${NSD_CreateCheckbox} 0 44u 100% 12u "Also delete my settings, names and streak"
    Pop $PawsWipeBox
    nsDialogs::Show
  FunctionEnd

  Function un.PawsWipeLeave
    ${NSD_GetState} $PawsWipeBox $PawsWipe
  FunctionEnd
!macroend

!macro customUnInstall
  ${ifNot} ${isUpdated}
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "Paws"
    Delete "$DESKTOP\Paws.lnk"
    ${if} $PawsWipe == ${BST_CHECKED}
      RMDir /r "$APPDATA\Paws"
    ${endIf}
  ${endIf}
!macroend
